# Sentry — Crash reporting + performance monitoring

**Date** : 8 juin 2026
**Status** : Code prêt, activation requiert compte Sentry + DSN.

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

`@sentry/react-native` est dans `plugins` → Expo génère config native (iOS
Podfile + Android Gradle) au build. Sourcemap upload peut être ajouté
plus tard (cf section "Sourcemaps").

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

## Sourcemaps (post-TestFlight)

Sans sourcemaps, les stack traces Sentry montrent du JS minifié
illisible. Pour upload auto à chaque build EAS :

1. Sentry Auth Token : Sentry → Settings → Account → Auth Tokens →
   Create new token (project:write scope)
2. EAS secret :
   ```bash
   eas secret:create --scope project --name SENTRY_AUTH_TOKEN --value <token>
   ```
3. Ajout au build script dans `package.json` :
   ```json
   "scripts": {
     "postbuild": "npx sentry-expo-upload-sourcemaps dist"
   }
   ```

Pas urgent V1 — TestFlight initial fonctionne sans sourcemaps, on peut
les ajouter avant submit App Store.

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
- **Sourcemaps** : sans upload, les stack traces sont quasi inutiles. À
  faire avant prod, pas obligatoire TestFlight.
- **iOS dSYMs** : pour symboliser les crashes natifs iOS, Sentry a besoin
  des fichiers .dSYM. EAS upload auto via le plugin Sentry config dans
  `app.json` (déjà set).
- **GDPR / RGPD** : Sentry par défaut collecte IP + breadcrumbs. Pour
  conformité RGPD stricte, ajouter `sendDefaultPii: false` à l'init. Pas
  pertinent V1 (RGPD permet legitimate interest sur crash reporting).
