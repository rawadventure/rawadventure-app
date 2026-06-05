# EAS Build + Apple Dev + Google Play — Setup guide

**Date** : 5 juin 2026
**Statut** : Préparation TestFlight + Play Store
**Dépendances** : Compte Apple Developer Organization (DUNS en cours), Compte Google Play

---

## 1. Vue d'ensemble

| Étape | Owner | Délai | Statut |
|---|---|---|---|
| eas.json créé | Claude | ✓ | ✅ |
| Compte Expo (admin@rawadventure.world) | Stéphane | 5 min | ⏳ |
| `eas login` + `eas init` | Stéphane | 10 min | ⏳ |
| Compte Apple Developer Organization | Stéphane | 1-4 sem (DUNS) | ⏳ Bloqué |
| Apple Team ID + ASC App ID | Stéphane | 30 min après Apple Dev | ⏳ |
| Compte Google Play Console | Stéphane | 1-2 jours | ⏳ |
| Google Play Service Account JSON | Stéphane | 30 min après Play Console | ⏳ |
| Premier build dev (`eas build --profile development`) | Stéphane | 30 min | ⏳ |
| Premier build TestFlight (`eas submit --profile production --platform ios`) | Stéphane | 1h | ⏳ |

---

## 2. eas.json — 3 profils de build

Le fichier `eas.json` à la racine du repo configure 3 profils :

### Profil `development`
- **Usage** : développement local avec dev client
- **iOS** : simulateur (pas besoin de provisioning Apple)
- **Android** : APK debug
- **Distribution** : interne uniquement
- **Commande** : `eas build --profile development --platform ios`

### Profil `preview`
- **Usage** : tests internes équipe (Mimi, Jacky, beta-testeurs)
- **iOS** : device réel via TestFlight interne ou ad-hoc
- **Android** : APK installable hors store
- **Distribution** : interne (TestFlight ou lien direct)
- **Commande** : `eas build --profile preview --platform all`

### Profil `production`
- **Usage** : App Store + Play Store
- **iOS** : App Store build, signed avec distribution cert
- **Android** : app bundle (.aab) signé pour Play Store
- **Auto-increment** : numéro de version build auto
- **Commande** : `eas build --profile production --platform all`
- **Submit** : `eas submit --profile production --platform all`

---

## 3. Setup Expo (Stéphane)

### 3.1 Création compte Expo

1. https://expo.dev/signup
2. Email : `admin@rawadventure.world` (cohérent Apple ID business)
3. Organization name : `Raw Adventure`
4. Plan : **Free** (suffit V1, ~30 builds/mois inclus)

### 3.2 Login local + init projet

Dans Terminal :
```bash
cd /Users/ASUS/RawAdventureRN
npx eas-cli login
# Saisis email + password Expo
npx eas-cli init
# Confirme création projet sous org "rawadventure"
```

Ceci ajoute `extra.eas.projectId` dans `app.json`.

### 3.3 Premier build dev (simulateur)

```bash
npx eas-cli build --profile development --platform ios
```

Premier build ~15-20 min sur les serveurs Expo. Résultat : URL `.tar.gz` à télécharger et installer sur simulateur via `xcrun simctl install booted /path/to/app`.

---

## 4. Apple Developer Organization (Stéphane)

### 4.1 Prérequis

- ✅ Société immatriculée : Raw Adventure Limited HK (CR 80310100)
- ✅ Adresse vérifiable : Unit 1603, 16/F The L. Plaza, Sheung Wan, HK
- ⏳ Apple ID dédié : `admin@rawadventure.world` (création bloquée temporairement, voir Section 8)
- ⏳ DUNS Number (gratuit via Apple DUNS lookup)

### 4.2 DUNS lookup

1. https://developer.apple.com/enroll/duns-lookup/
2. Login avec Apple ID dédié
3. Remplis :
   - Legal Entity Name : `Raw Adventure Limited`
   - Country : Hong Kong
   - Address Line 1 : `Unit 1603, 16/F The L. Plaza`
   - Address Line 2 : `367-375 Queen's Road Central`
   - City : `Sheung Wan`
   - Postal Code : laisser vide ou `000000` (HK n'a pas de code postal)
   - Work Email : `stephane@rawadventure.world`
   - Work Phone : numéro business
4. Résultats possibles :
   - DUNS trouvé → numéro fourni immédiatement
   - DUNS en cours → email reçu sous 5-30 jours
   - Pas trouvé → bouton "Get a D-U-N-S Number" → formulaire D&B

### 4.3 Apple Developer Program enrollment

Une fois DUNS reçu :
1. https://developer.apple.com/programs/
2. "Enroll" → Sign in Apple ID admin@rawadventure.world
3. Type : **Organization**
4. Entity type : **Other Business Entity** (HK Limited Company)
5. Saisis DUNS → auto-remplit nom + adresse
6. Téléphone vérification (Apple appelle)
7. Paiement 99 USD/an (validité 1 an, renouvellement auto)
8. Validation Apple 24-48h → email confirmation

### 4.4 Récupère Team ID

Une fois compte actif :
1. https://developer.apple.com/account
2. Membership → noter **Team ID** (10 caractères type `ABC1234567`)
3. Mettre à jour `eas.json` :
   ```json
   "submit": {
     "production": {
       "ios": {
         "appleTeamId": "TON_TEAM_ID"
       }
     }
   }
   ```

### 4.5 App Store Connect — crée l'app

1. https://appstoreconnect.apple.com
2. "My Apps" → "+" → "New App"
3. Bundle ID : `world.rawadventure.app` (déjà dans `app.json`)
4. Name : `Raw Adventure`
5. Primary language : French
6. SKU : `RAWADV001` (interne, peu importe)
7. Validation → noter **ASC App ID** (10 chiffres)
8. Mettre à jour `eas.json` :
   ```json
   "ios": {
     "ascAppId": "1234567890"
   }
   ```

---

## 5. Google Play Console (Stéphane)

### 5.1 Création compte

1. https://play.google.com/console/signup
2. Type : **Organization** (recommandé)
3. Compte Google dédié : créer `admin@rawadventure.world` côté Google Workspace OU utiliser un alias Gmail pour V1
4. Frais inscription : **25 USD one-shot** (à vie)
5. Verify identity : ID + adresse société HK
6. Délai validation : 24-48h (parfois jusqu'à 7 jours pour orgs internationales)

### 5.2 Crée l'application

1. Login Play Console → "All apps" → "Create app"
2. App name : `Raw Adventure`
3. Default language : French
4. Type : `App` (pas `Game`)
5. Free or paid : `Free` (avec in-app purchases si Phase 1 abonnement)
6. Confirme déclarations

### 5.3 Service Account JSON (pour EAS submit)

1. Console Cloud Google : https://console.cloud.google.com
2. Crée projet : "Raw Adventure"
3. APIs & Services → Library → cherche "Google Play Android Developer API" → Enable
4. IAM → Service Accounts → Create
   - Name : `eas-submit`
   - Role : pas requis ici (sera lié dans Play Console)
   - Create key → JSON → télécharge
5. Renomme fichier en `google-play-service-account.json` et place à la racine du repo
6. **Vérifie** : déjà gitignored (cf. `.gitignore`)
7. Play Console → Setup → API access → Link Cloud project → invite ce service account avec permissions "Release manager"
8. EAS submit utilisera ce JSON via `submit.production.android.serviceAccountKeyPath`

---

## 6. Workflow build & submit (post-setup)

### 6.1 Dev build iOS (simulateur)

```bash
npx eas-cli build --profile development --platform ios
# Attend ~15 min
# Télécharge .tar.gz depuis URL fournie
tar -xzf RawAdventure.tar.gz
xcrun simctl install booted RawAdventure.app
xcrun simctl launch booted world.rawadventure.app
```

### 6.2 Preview TestFlight interne

```bash
npx eas-cli build --profile preview --platform ios
# Build + auto-upload TestFlight si configured
npx eas-cli submit --profile preview --platform ios
```

Mimi/Jacky reçoivent invite TestFlight via Apple ID renseigné dans App Store Connect → testers internes.

### 6.3 Production release

```bash
npx eas-cli build --profile production --platform all
npx eas-cli submit --profile production --platform all
```

Validation Apple : ~24-48h.
Validation Play : ~3-7 jours premier release, ~few hours updates.

---

## 7. Variables d'environnement & secrets

EAS Build n'a pas accès aux `.env` locaux. Configurer via :

```bash
npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://xxx.supabase.co"
npx eas-cli secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJxxx..."
```

Vérifier : `npx eas-cli secret:list`

---

## 8. Blocages connus + workarounds

### Apple ID création bloquée (5 juin 2026)

Anti-fraud limit Apple suite à plusieurs essais SMS codes. Solutions :
1. Attendre 24-48h pour expiration du block
2. Réessayer depuis iPhone Réglages (méthode `Réglages → [nom] → Médias et achats → Sign out` puis créer via App Store)
3. Apple Support chat : https://support.apple.com → Apple ID

Une fois Apple ID créé, mettre à jour `eas.json` `submit.production.ios.appleId`.

### Domaine email `admin@rawadventure.world` pas créé

Pré-requis : custom domain Proton actif pour `rawadventure.world`. Si pas encore, créer alias rapide :
1. Proton Mail → Settings → Domain Names
2. Add `rawadventure.world` (suit instructions DNS)
3. Add address : `admin@rawadventure.world`

---

## 9. Coûts récurrents annuels

| Service | Coût |
|---|---|
| Apple Developer Program | 99 USD/an |
| Google Play Console | 25 USD one-shot |
| Expo Build | Free (V1) — Production tier ~99 USD/mois si volume |
| Domaine OVH `rawadventure.world` | ~15 €/an |
| Proton Mail Business custom domain | ~7 €/mois |
| Supabase | Free tier V1 — Pro 25 USD/mois si volume |
| Stripe | 1.4% + 0.25 € EU / 2.9% + 0.30$ international |

**Total fixe annuel hors transactions** : ~250 USD + ~90 EUR + Supabase si croissance.

---

## 10. Checklist pré-launch stores

### App Store

- [ ] Apple Dev Org actif + Team ID renseigné `eas.json`
- [ ] App Store Connect : app créée + ASC App ID renseigné `eas.json`
- [ ] Description app (Reader App pattern — neutre, voir Feature Spec abonnement §10.1)
- [ ] Screenshots iPhone 6.7" + 6.5" (5 par taille min)
- [ ] Icon 1024x1024 (déjà dans `assets/icon.png`)
- [ ] Privacy Policy URL : `https://rawadventure.world/politique-confidentialite`
- [ ] Support URL : `https://rawadventure.world` ou `mailto:support@rawadventure.world`
- [ ] Marketing URL (optionnel)
- [ ] Age rating : 17+ probable (contenu santé, abonnement)
- [ ] In-App Purchases : N/A (Reader App, paiement web externe)
- [ ] TestFlight Internal Testing : invite Mimi + Jacky + 1-2 beta

### Play Store

- [ ] Play Console actif + service account JSON ajouté
- [ ] App créée + bundle ID `world.rawadventure.app`
- [ ] Description courte + complète FR
- [ ] Screenshots Android (min 2 phones + 1 7" tablet recommandé)
- [ ] Feature graphic 1024x500
- [ ] Icon (foreground 512x512 PNG)
- [ ] Content rating questionnaire
- [ ] Data safety form
- [ ] Privacy Policy URL : `https://rawadventure.world/politique-confidentialite`
- [ ] Test internal track : 10 testeurs max

---

*Document à mettre à jour quand Apple Dev débloque + Play Console actif.*
