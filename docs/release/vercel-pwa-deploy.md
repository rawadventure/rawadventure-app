# Vercel PWA Deploy

**Date** : 9 juin 2026
**Status** : Config prête, déploiement à faire via Dashboard Vercel.

---

## Pourquoi

Distribution alternative pendant l'attente DUNS HK (~14j) + Apple Dev /
Play Console. Mimi/Jacky peuvent tester l'app sur leur iPhone/Android
via Safari → "Ajouter à l'écran d'accueil" → fonctionne comme une app
native (presque).

## Config en place

### vercel.json (repo root)

- **Build command** : `npx expo export --platform web`
- **Output directory** : `dist`
- **Install command** : `npm install --legacy-peer-deps`
- **Rewrites** : SPA fallback `/(.*)` → `/index.html` (routes React Navigation)
- **Headers** : cache long pour static assets (`/_expo/static/*`, `/assets/*`)

### Helper openExternal (déjà commit `6b8bd0b`)

`src/lib/openExternal.ts` détecte `Platform.OS`. Web → `window.location`.
Native → `WebBrowser.openBrowserAsync`. PaywallScreen + ProfilTabScreen
utilisent ce helper.

### Legal site (déjà commit `7c79a9e`)

`checkout-success.md` + `account-returned.md` détectent mobile vs desktop
dans le JS. Desktop → message friendly. Mobile → tente deep link.

## Steps Stéphane

### 1. Créer compte Vercel (~2 min)

URL : `https://vercel.com/signup`

- Plan : **Hobby (gratuit)**
- Login via GitHub recommandé (auto-link au repo)

### 2. Importer repo (~1 min)

- Dashboard Vercel → **Add New → Project**
- Sélectionne **`rawadventure/rawadventure-app`** (le repo privé)
- Vercel détecte automatiquement `vercel.json` → tout est pré-configuré
- Ne change rien aux defaults — `vercel.json` overrides

### 3. Configurer env vars (~2 min)

Avant le premier deploy, dans Vercel project settings → **Environment Variables** :

```
EXPO_PUBLIC_SUPABASE_URL = https://aknvitrtfxqjdwiyxryt.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY = <copie depuis .env local>
EXPO_PUBLIC_SENTRY_DSN = https://04f0752a93809c922ff3cd2c4d8dcccc@o4511528227307520.ingest.de.sentry.io/4511528239104080
```

Scope : **Production + Preview + Development** (tous).

### 4. Deploy (~3-5 min)

- Click **Deploy**
- Vercel install + build cloud (~3-5 min)
- URL temporaire générée : `https://rawadventure-app-xxx.vercel.app`

### 5. Test URL Vercel

- Safari Mac : `https://rawadventure-app-xxx.vercel.app`
- App charge → login → flow normal
- Si OK → passer à l'étape 6

### 6. (Optionnel) Domaine custom `app.rawadventure.world`

Vercel project settings → **Domains** → **Add** :
- Saisis `app.rawadventure.world`
- Vercel donne instructions DNS :
  - Soit CNAME `app` → `cname.vercel-dns.com`
  - Soit A record (selon disponibilité)

Côté OVH (DNS rawadventure.world) :
- Zone DNS → ajoute entrée CNAME
  - Sous-domaine : `app`
  - Cible : `cname.vercel-dns.com.`
  - TTL : 600
- Sauvegarde
- Propagation DNS : 1-30 min selon registar

Vérif :
```bash
dig app.rawadventure.world CNAME
curl -I https://app.rawadventure.world/
```

Une fois propagé → HTTPS auto par Vercel (Let's Encrypt) → URL finale
opérationnelle.

### 7. Partager URL Mimi/Jacky

Envoie l'URL Safari iOS (recommandé pour PWA install) :
1. Ouvre Safari iPhone
2. Tape `app.rawadventure.world`
3. App charge
4. Bouton Partager (carré flèche haut) → **"Sur l'écran d'accueil"**
5. Confirme → icône Raw Adventure apparaît home screen
6. Tap icône → app lance en plein écran (looks native)

Pour Android :
1. Chrome Android
2. `app.rawadventure.world`
3. Menu ⋮ → **"Installer l'application"** (apparaît si manifest valide)
4. Ou prompt natif au bout de quelques visites

## Gotchas

- **Bundle 5.35 Mo** : premier load ~3-5s en 4G. Acceptable. Worker cache
  pour visites suivantes.
- **Pas de push notifications iOS PWA** sans gestion Web Push manuelle.
  Pour V1 = accepté, on enverra rappels Telegram aux testeurs.
- **expo-av Video** : marche en HTML5 (player navigateur). Pas de
  presentFullscreenPlayer → fullscreen via bouton player natif HTML5
  (différent du natif iOS mais marche).
- **Linking deep links** : sur PWA, les `rawadventure://` ne fonctionnent
  pas → checkout-success + account-returned détectent et basculent
  message friendly (déjà patché).
- **Mises à jour** : `git push main` → Vercel auto-deploy. ~3 min. Pas
  besoin de re-build manuellement.

## Trace audit

- `vercel.json` : config build + SPA rewrite + cache
- `src/lib/openExternal.ts` : helper native/web
- `legal-site/checkout-success.md` + `account-returned.md` : détection
  mobile/desktop
- Doc Trello task : "PWA app.rawadventure.world deploy" (à créer)
