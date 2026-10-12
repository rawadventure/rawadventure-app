# Sentry — Crash reporting + performance monitoring

**Date** : 8 juin 2026
**Status** : actif en PWA (DSN sur Vercel, source maps web uploadées). Builds natifs : upload des source maps câblé par le plugin, jeton EAS à poser (R6-25, 12 oct 2026).

---

## Pourquoi

Sans crash reporting, on découvre les bugs prod via :
- Reviews 1 étoile App Store ("l'app crashe à l'ouverture")
- Tickets support du genre "ça marche pas"
- Twitter/Telegram users frustrés

Avec Sentry on a :
- **Stack traces côté natif iOS / Android** (pas juste JS)
- **Breadcrumbs** (les 50 dernières actions user avant le crash)
- **Device context** (OS, version, model, free memory)
- **User context** (user_id Supabase → trier les crashs par user)
- **Source maps** (le code original, pas le bundle minifié)
- **Alertes Slack/email** sur crash récurrent

Quota gratuit Sentry : 5000 erreurs/mois + 10k transactions perf. Largement
suffisant pour V1 (volume < 1000 users prévu).

## Architecture

```
[App boot]
   ↓
   process.env.EXPO_PUBLIC_SENTRY_DSN défini ?
     ↓ Oui                          ↓ Non
   Sentry.init(...)               skip (no-op)
     ↓
   Sentry.wrap(App) (ErrorBoundary global)
     ↓
   ──────── Runtime ────────
   - Native crash (iOS .crash, Android tombstone) → captured + symbolized
   - JS exception non-catchée → captured + breadcrumbs
   - Network error filtré (Network request failed, aborted) → skip
   - Sentry.captureException(err) manuel pour cas spécifiques
     ↓
   Upload via HTTPS → ingest.sentry.io
     ↓
   Dashboard Sentry → Issues groupées par stack trace + frequency
```

## Code en place

### App.tsx (init + wrap)

```typescript
import * as Sentry from '@sentry/react-native';

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    enabled: !__DEV__,  // skip dev (pollue avec hot reload errors)
    sampleRate: 1.0,
    tracesSampleRate: 0.1,
    release: 'rawadventure@1.0.0',
    environment: __DEV__ ? 'development' : 'production',
    beforeSend(event, hint) {
      // Filtre erreurs réseau attendues
      if (err?.message?.includes('Network request failed')) return null;
      ...
    },
  });
}

export default Sentry.wrap(App);
```

### app.json plugins

`@sentry/react-native/expo` est dans `plugins` → Expo génère la config
native (Xcode build phases + Gradle) au build, upload des source maps
compris (cf section "Sourcemaps").

### .env.example

`EXPO_PUBLIC_SENTRY_DSN` documenté + commenté.

## Activation — Steps Stéphane

### 1. Crée compte Sentry (~3min)

- URL : `https://sentry.io/signup/`
- Plan : **Developer (Free)** — 5k errors/mois suffisant
- Crée orga `rawadventure`

### 2. Crée projet (~1min)

- Sidebar gauche → **Projects** → **+ Create Project**
- Platform : **React Native**
- Project name : `rawadventure-app`
- Team : default
- Alert : "Alert me on every new issue" (ON)
- → **Create project**

### 3. Récupère DSN (~30s)

- Project Settings → **Client Keys (DSN)**
- Copie le DSN — format : `https://abcd1234@o123456.ingest.sentry.io/9876543`

### 4. Ajoute DSN au .env local

```bash
echo "EXPO_PUBLIC_SENTRY_DSN=https://abcd1234@o123456.ingest.sentry.io/9876543" >> /Users/ASUS/RawAdventureRN/.env
```

(Adapte avec le vrai DSN.)

### 5. Rebuild app (pour que native module Sentry soit linké)

```bash
cd /Users/ASUS/RawAdventureRN && LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 npx expo run:ios --device F6A99451-FEF4-4229-8C40-C012B1F0DD47
```

~5-10min.

### 6. Test crash volontaire

Dans simu, après build :
- App → ouvre Profil → ajoute DEV button temporaire qui throw new Error
- Tap → crash JS → captured (mais enabled=false en DEV, donc rien remonte
  immédiatement)
- Pour test réel : build production OU set `enabled: true` temporairement

OU plus simple : enroule app dans build prod (EAS preview) + crash test :
```bash
eas build --profile preview --platform ios
# install sur device → crash → vérifie Sentry dashboard
```

### 7. Configure alerts

Sentry Dashboard → Alerts → "+ Create Alert" :
- Trigger : "When the number of events for an issue is > 5 in 1 hour"
- Action : Email à `support@rawadventure.world`

## User context (best practice)

Quand l'utilisateur se connecte, attache son ID à Sentry pour grouper
les crashs par user :

```typescript
// Dans AuthContext, après login réussi :
import * as Sentry from '@sentry/react-native';
Sentry.setUser({
  id: user.id,
  email: user.email, // optionnel — Sentry est compliant RGPD
});

// Au logout :
Sentry.setUser(null);
```

À ajouter dans `src/hooks/AuthContext.tsx` après l'événement `SIGNED_IN`
de Supabase. Pas fait maintenant — pas critique TestFlight, simple
follow-up.

## Sourcemaps — builds natifs EAS (R6-25, 12 octobre 2026)

Sans source maps, les stack traces Sentry montrent du JS minifié illisible.
Le plugin `@sentry/react-native/expo` (déjà dans `app.json`) injecte lui-même
les phases d'upload au build natif : source maps JS + dSYM côté iOS
(`sentry-xcode.sh`, `sentry-xcode-debug-files.sh`), source maps JS côté
Android (`sentry.gradle`). Il n'y a **aucun hook EAS à écrire** : il suffit
que `SENTRY_AUTH_TOKEN` soit présent dans l'environnement de build.

Attention : sans jeton, l'upload iOS **fait échouer le build** (exit 1 dans
`sentry-xcode.sh`). Le jeton doit donc être posé sur EAS **avant** le premier
build `preview` ou `production` (R6-17 / R6-18).

### Mise en place (une fois, Stéphane)

1. Sentry → Settings → Auth Tokens → Create new token. Scopes
   `project:releases`, `project:write`, `org:read`. Nom `eas-build`.
2. Variable d'environnement EAS (secret, lue au build) :
   ```bash
   eas env:create --scope project --name SENTRY_AUTH_TOKEN --type string --visibility secret --environment production --environment preview
   ```
   (`eas secret:create` est déprécié depuis eas-cli 12, ne plus l'utiliser.)
3. Vérifier : `eas env:list --scope project --environment production`.

Profil `development` (`eas.json`) : `SENTRY_DISABLE_AUTO_UPLOAD=true` — build
simulateur, config Debug, upload inutile et pas de jeton requis.

### Association release ↔ source maps

Les source maps JS natives sont liées aux événements par **Debug ID**
(injecté par sentry-cli au bundle), pas par le nom de release. Le `release:
rawadventure@<version>` fixé dans `App.tsx` (F-12) sert à l'onglet Releases
et au web Vercel ; il n'a pas besoin de coïncider avec le nom natif
`world.rawadventure.app@<version>+<build>`.

### Mises à jour OTA (`eas update`)

Le plugin ne couvre que les builds. Pour un bundle poussé par `eas update`,
uploader les source maps à la main juste après, avec `SENTRY_AUTH_TOKEN`
dans l'environnement local :

```bash
eas update --channel production --message "..."
npm run sourcemaps:update
```

(`sourcemaps:update` = `sentry-expo-upload-sourcemaps dist`, lit org/projet
dans `app.json`.)

### Vérification

- Log du build EAS : lignes `sentry-cli - Source Map Upload Report` sans
  erreur (iOS : plus `debug-files upload` pour les dSYM).
- Sentry → Settings → Projects → rawadventure → Source Maps : un bundle
  d'artefacts par build.
- **Contrôle fait le 12 octobre 2026** sur le build `preview` Android
  `72fcc692` (premier build EAS du projet, 20 min, aucun avertissement) :
  log « Uploading sourcemaps for release world.rawadventure.app@1.0.0+1
  distribution 1 », « Uploaded files to Sentry », « Source Map Upload
  Report » avec `index.android.bundle` + `.map` et le même Debug ID.
  Chemin UI pour voir le bundle (doc Sentry) : Settings → Projects →
  rawadventure → **Source Maps**, soit
  https://adventure-limitedraw.sentry.io/settings/projects/rawadventure/source-maps/
- iOS : à contrôler au premier build R6-17 (dSYM en plus des source maps).

## Trace audit

- `App.tsx` : init + wrap
- `app.json` plugins : `@sentry/react-native`
- `.env.example` : doc DSN
- `package.json` : `@sentry/react-native` dep ajoutée
- Filtres `beforeSend` : Network request failed, aborted

## Gotchas

- **DEV mode skip** : `enabled: !__DEV__` → en dev local rien remonte. Pour
  tester en dev, change temporairement à `true`.
- **EXPO_PUBLIC_ prefix** : Expo n'injecte que les vars commençant par
  `EXPO_PUBLIC_` dans le bundle JS. Sans préfixe, `process.env.X` est
  `undefined` côté client.
- **Sourcemaps** : upload automatique par le plugin au build natif, à
  condition que `SENTRY_AUTH_TOKEN` soit posé sur EAS — sinon le build iOS
  échoue (voir section Sourcemaps).
- **iOS dSYMs** : pour symboliser les crashes natifs iOS, Sentry a besoin
  des fichiers .dSYM. EAS upload auto via le plugin Sentry config dans
  `app.json` (déjà set).
- **GDPR / RGPD** : Sentry par défaut collecte IP + breadcrumbs. Pour
  conformité RGPD stricte, ajouter `sendDefaultPii: false` à l'init. Pas
  pertinent V1 (RGPD permet legitimate interest sur crash reporting).
