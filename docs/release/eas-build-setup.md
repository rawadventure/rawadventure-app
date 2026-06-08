# EAS Build — Setup TestFlight

**Date** : 8 juin 2026
**Status** : Config prêt, activation requiert compte Apple Dev (DUNS en cours).

---

## Pourquoi EAS Build

Build local (`npx expo run:ios`) = simulateur uniquement, pas signé pour
distribution. **TestFlight requiert un build signé via Apple Dev account**,
upload sur App Store Connect, puis distribution beta aux testeurs.

EAS Build = build cloud Expo qui :
- Compile dans une VM macOS/Ubuntu
- Signe automatiquement (gère certificats + provisioning profiles)
- Upload artefact (.ipa pour iOS, .aab pour Android) sur S3 EAS
- Optionnel : submit auto vers App Store Connect / Play Console

Plan d'abonnement EAS : **free tier** suffit pour démarrer (30 builds/mois,
pas de priority queue). Upgrade `Production` (~99 USD/mois) si volume builds
augmente significativement.

## Ce qui est déjà en place

### eas.json (3 profils + submit)

- **development** : build dev avec `developmentClient`, distribution
  interne, iOS simulator OU device, Android APK debug. Pour tester sur
  device physique sans App Store.
- **preview** : build internal distribution (TestFlight non requis pour
  iOS interne, Android APK pour partage direct). Pour beta restreinte
  pré-TestFlight.
- **production** : build signé production, autoIncrement build number,
  channel `production`. C'est ce qui part en TestFlight puis App Store /
  Play Store.

### app.json (EAS-ready)

- `runtimeVersion: { policy: "appVersion" }` — chaque version app (1.0.0,
  1.0.1) a son propre runtime, garantit que les updates OTA ne crashent
  pas sur incompatibilité native.
- `updates.url` — placeholder `PLACEHOLDER_EAS_PROJECT_ID` à remplacer
  après `eas init`.

### .easignore

Exclut `docs/`, `kanban/`, `legal-site/`, `assets/store-screenshots/`,
`.claude/` du tarball uploadé. Réduit taille upload (~50 Mo au lieu de ~150 Mo).

### Submit config (eas.json)

Placeholders pour Apple credentials :
- `appleId` : `admin@rawadventure.world` (Apple ID gestionnaire org)
- `ascAppId` : `TO_BE_FILLED_AFTER_APP_STORE_CONNECT_CREATION`
- `appleTeamId` : `TO_BE_FILLED_AFTER_APPLE_DEV_ENROLLMENT`

Google Play submit :
- `serviceAccountKeyPath` : `./google-play-service-account.json` (à créer
  côté Google Cloud Console post-Play Console activation, déjà dans
  `.gitignore`).

## Activation — Steps Stéphane

### 1. Install EAS CLI globalement (~1 min)

```bash
npm install -g eas-cli
eas --version  # vérif install
```

Si erreur permissions : `sudo npm install -g eas-cli` OU configure npm prefix
local (`mkdir ~/.npm-global && npm config set prefix ~/.npm-global` + ajout
PATH).

### 2. Login Expo (compte gratuit)

```bash
eas login
```

- Crée compte sur `https://expo.dev` si pas déjà fait
- Utilise email `admin@rawadventure.world` (ou ton perso)
- Pour org : crée organisation `rawadventure` plus tard, transfère le projet

### 3. Init EAS dans projet (~30s)

```bash
cd /Users/ASUS/RawAdventureRN
eas init
```

- Crée l'EAS project côté serveur Expo
- Injecte `extra.eas.projectId` dans `app.json` automatiquement
- Met à jour `updates.url` avec le vrai projectId

Commit la modif :
```bash
git add app.json && git commit -m "EAS init : projectId généré" && git push
```

### 4. (Optionnel) Build dev simulateur — sanity check

```bash
eas build --profile development --platform ios
```

- Demande certificats si premier build → choisis "Yes, let EAS handle"
- Pour development profile : pas besoin Apple Dev account (simulator build)
- ~15-20 min cloud
- Artefact .tar.gz téléchargeable, à drag-drop sur simulateur ouvert

### 5. Build production iOS (post Apple Dev activation)

**Prérequis** :
- Compte Apple Developer Organization actif (DUNS reçu + enrollment validé)
- App créée dans App Store Connect (nom "Raw Adventure", bundle
  `world.rawadventure.app`)
- Apple Team ID récupéré → remplace `TO_BE_FILLED_AFTER_APPLE_DEV_ENROLLMENT`
  dans `eas.json` (3 endroits potentiels) + dans
  `legal-site/.well-known/apple-app-site-association` (activation Universal Link)
- ASC App ID récupéré → remplace `TO_BE_FILLED_AFTER_APP_STORE_CONNECT_CREATION`

```bash
eas build --profile production --platform ios
```

- EAS génère + signe automatiquement (Distribution certificate +
  Provisioning profile App Store)
- ~20-30 min build cloud
- Artefact .ipa disponible

### 6. Submit TestFlight

```bash
eas submit --profile production --platform ios --latest
```

- Upload .ipa vers App Store Connect via API
- Notification email quand processing TestFlight terminé (~5-15 min)
- Configure beta groups dans App Store Connect → TestFlight tab
- Invite testeurs par email (max 10000 testeurs externes via groupe)

### 7. (Plus tard) Build + submit Android

```bash
eas build --profile production --platform android
eas submit --profile production --platform android --latest
```

Prérequis Android :
- Compte Google Play Console actif (DUNS reçu)
- App créée dans Play Console
- Service account JSON Google Play API → `./google-play-service-account.json`
  (cf docs Google : Play Console → Setup → API access → Service accounts)

## Gotchas

- **EAS Update OTA** : runtimeVersion `appVersion` policy = chaque
  bump version (1.0.0 → 1.0.1) crée un nouveau runtime. Les anciens
  utilisateurs ne reçoivent pas l'update OTA, doivent passer par store
  pour update. Pour OTA fluide (corrections copy / icons), bump seulement
  buildNumber (auto via `autoIncrement` profile production), pas version
  string.
- **Bundle identifier collision** : si tu changes `world.rawadventure.app`
  après premier build, EAS demande de regénérer certificats.
- **Provisioning profile auto-renouvellement** : EAS gère, pas
  d'intervention manuelle nécessaire sauf si expiration > 1 an.
- **App Store Review** : premier submit prend ~24-72h. Test compte démo
  (`demo@rawadventure.world` + `RawDemo2026!`) à fournir dans App Store
  Connect → App Information → App Review Information. Note : voir
  remarque sur email accessible réel post-DUNS dans audit.
- **TestFlight build expiration** : 90 jours. Rebuild requis si beta
  longue.

## Trace audit

- `eas.json` : 3 profils + submit
- `app.json` : runtimeVersion + updates url placeholder
- `.easignore` : exclusions upload
- Bundle ID : `world.rawadventure.app` (iOS + Android, identiques)
- Apple credentials placeholders : à remplir post-DUNS dans 3 fichiers
  (eas.json, AASA file, optionnel app.json `ios.usesAppleSignIn` etc.)

## Estimation activation

| Étape | Effort | Owner |
|---|---|---|
| Install EAS CLI + login | 5 min | Stéphane |
| `eas init` | 30 s | Claude (lance commande) |
| Build dev sanity check | 20 min cloud | Claude (lance, monitor) |
| Récup Apple Team ID + ASC App ID | 30 min | Stéphane (post-DUNS) |
| Remplir placeholders eas.json + AASA | 5 min | Claude |
| Build production iOS | 30 min cloud | Claude |
| Submit TestFlight | 5 min + processing | Claude |
| Setup beta groups + invites | 30 min | Stéphane |
| **Total après DUNS** | **~1h30 + 1h cloud** | mixed |
