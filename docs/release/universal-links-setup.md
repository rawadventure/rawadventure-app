# Universal Links iOS + App Links Android — Setup

**Date** : 6 juin 2026
**Status** : Préparé, activation requiert credentials Apple/Google.

---

## Pourquoi

SFSafariViewController iOS bloque les liens custom scheme (`rawadventure://`)
ouverts via `<a href>`. Workaround temporaire (cf. `legal-site/checkout-success.md`) :
JavaScript `window.location` au tap utilisateur.

Solution propre : **Universal Links** (iOS) + **App Links** (Android) — l'OS
intercepte des URL `https://rawadventure.world/...` et ouvre l'app
directement si installée.

## Ce qui est déjà en place

### Côté site (legal-site/.well-known/)

- `apple-app-site-association` (AASA) — JSON sans extension, hébergé à
  `https://rawadventure.world/.well-known/apple-app-site-association`
- `assetlinks.json` — Android Digital Asset Links, hébergé à
  `https://rawadventure.world/.well-known/assetlinks.json`
- `_config.yml` : `include:` ajouté pour que Jekyll ne skip pas `.well-known`

### Côté app (app.json)

- `ios.associatedDomains: ["applinks:rawadventure.world"]`
- `android.intentFilters` avec `autoVerify: true` sur `/subscription-success`
  et `/checkout-success`

## Ce qui reste à faire — Activation

### iOS (post compte Apple Developer)

1. Récupère ton **Apple Team ID** dans developer.apple.com → Membership.
   Format : 10 chars alphanumériques (ex. `A1B2C3D4E5`).
2. Édite `legal-site/.well-known/apple-app-site-association` :
   remplace `REPLACE_WITH_TEAMID` par ton Team ID.
   Exemple final : `"appID": "A1B2C3D4E5.world.rawadventure.app"`
3. Push legal-site → GitHub Pages déploie.
4. Vérifie en navigateur :
   `https://rawadventure.world/.well-known/apple-app-site-association`
   doit renvoyer JSON avec Content-Type `application/json` (ou
   `application/pkcs7-mime`, les deux OK pour Apple).
5. Vérifie via outil Apple :
   `https://search.developer.apple.com/appsearch-validation-tool/`
   ou commande terminal :
   ```bash
   curl -v https://rawadventure.world/.well-known/apple-app-site-association
   ```
6. Crée nouveau build EAS iOS (`eas build --platform ios`) — l'entitlement
   `associated-domains` sera signé automatiquement par Expo via le profil
   provisioning de ton Apple Dev account.
7. Installe sur device → tap lien `https://rawadventure.world/checkout-success`
   dans Safari ou Mail → doit ouvrir l'app directement.

### Android (post Google Play Console + premier build signé)

1. Build EAS Android signé (`eas build --platform android --profile production`).
2. Récupère le **SHA256 fingerprint** du certificat de signature :
   - Via EAS : `eas credentials` → Android → liste fingerprints
   - Ou via Play Console → Setup → App signing → "App signing key
     certificate" → SHA-256 certificate fingerprint
   - Format : 64 chars hex séparés par `:` (ex. `12:34:AB:CD:...`)
3. Édite `legal-site/.well-known/assetlinks.json` :
   remplace `REPLACE_WITH_SHA256_FROM_PLAY_CONSOLE`.
4. Push legal-site.
5. Vérifie :
   ```bash
   curl https://rawadventure.world/.well-known/assetlinks.json
   ```
6. Outil Google de validation :
   `https://developers.google.com/digital-asset-links/tools/generator`
7. Sur device Android (après install build signé) :
   ```bash
   adb shell pm get-app-links world.rawadventure.app
   ```
   Doit afficher `verified` pour `rawadventure.world`.

### Côté legal-site (post activation)

Une fois Universal Links validé, simplifie `checkout-success.md` :
remplace bouton `<button id="back-to-app-btn">` par lien direct :
```html
<a href="https://rawadventure.world/subscription-success" class="brand-cta">
  Retourner dans l'app
</a>
```
iOS / Android interceptent automatiquement, ouvrent l'app si installée,
fallback web si non installée.

### Côté app code (linking config)

Vérifie `src/navigation/...` ou wherever linking est configuré :
le handler doit accepter à la fois :
- `rawadventure://subscription-success` (custom scheme, fallback)
- `https://rawadventure.world/subscription-success` (Universal Link)

Si pas déjà fait, ajoute `prefixes` array dans linking config :
```typescript
const linking = {
  prefixes: [
    'rawadventure://',
    'https://rawadventure.world',
  ],
  config: {
    screens: {
      SubscriptionSuccess: 'subscription-success',
      CheckoutSuccess: 'checkout-success',
      // ... autres deep links
    },
  },
};
```

---

## Tests post-activation

1. **Device iOS** :
   - App installée → tap lien email/SMS `https://rawadventure.world/checkout-success`
     → ouvre app directement, pas Safari
   - App PAS installée → ouvre page web, propose download
2. **Device Android** :
   - Idem, vérif `pm get-app-links` shows `verified`
3. **E2E Stripe** :
   - Paye via TestFlight build → redirect `https://rawadventure.world/checkout-success`
     → Universal Link intercepte → app reprend automatiquement, plus de
     manipulation manuelle

---

## Gotchas

- **Apple cache l'AASA** ~24h. Si tu changes après déploiement, supprime
  l'app du device puis réinstalle (force re-fetch).
- **SHA256 dev vs prod** : si tu utilises plusieurs keystores (debug,
  internal testing, production), ajoute tous les fingerprints dans
  `assetlinks.json` (array dans `sha256_cert_fingerprints`).
- **GitHub Pages MIME** : sert AASA en `text/plain` par défaut. iOS accepte
  tout de même tant que le JSON parse. Si Apple Search Tool râle, ajouter
  un workaround via `.htaccess` est inutile (GH Pages ne lit pas
  `.htaccess`). Solution si besoin : héberger AASA sur sous-domaine via
  Cloudflare Workers ou Netlify avec headers custom.
- **Android `autoVerify: true`** : si le check échoue (assetlinks.json mal
  formé ou inaccessible), l'OS tombe en fallback "show chooser dialog"
  (utilisateur doit confirmer). Vérifie toujours après build prod.

---

*Setup conçu pour activation rapide post-DUNS / Apple Dev / Play Console.*
