# Brief screenshots stores V1

**Date** : 5 juin 2026
**Statut** : Production en cours sur iPhone 17 Pro Max simulator
**Cible** : App Store + Play Store

---

## 1. Tailles requises Apple App Store 2026

| Type | Device | Résolution exacte | Min nb |
|---|---|---|---|
| **6.9" iPhone Pro Max** | iPhone 17 Pro Max | 1320 × 2868 | 3 (reco 5-10) |
| 6.7" iPhone (legacy) | iPhone 8 Plus / 14 Pro Max | 1290 × 2796 | optionnel si 6.9" fourni |
| iPad 13" | iPad Pro M4 | 2064 × 2752 | 3 (si `supportsTablet: true` dans app.json) |

**Note** : Apple accepte iPhone 17 Pro Max comme canon depuis iOS 26. Les anciens 6.5" sont scalés automatiquement.

**Décision V1** : capture sur iPhone 17 Pro Max uniquement. iPad screenshots = à voir (peut retirer `supportsTablet: true` si V1 ne cible que phone).

## 2. Tailles requises Google Play 2026

| Type | Résolution | Min nb |
|---|---|---|
| **Phone** | min 1080 × 1920 | 2 (reco 4-8) |
| 7" Tablet | min 1024 × 600 | 1 (optionnel) |
| 10" Tablet | min 1280 × 800 | 1 (optionnel) |
| Feature graphic (header) | 1024 × 500 | 1 obligatoire |

V1 : phone uniquement. Réutilise les captures iPhone iOS, ajuste ratio si besoin.

---

## 3. 8 écrans clés à capturer

Ordre App Store recommandé (le 1er est le plus important — visible en preview).

### 3.1 — Splash / Hero
**Nom fichier** : `01-splash.png`
**Comment y accéder** : reset complet → relancer app
**Texte overlay (post-prod)** : "Reviens à toi en 14 jours"
**Pourquoi** : 1er écran vu en preview store, doit accrocher

### 3.2 — Phase 0 Home (7 actions visibles)
**Nom fichier** : `02-phase0-home.png`
**Comment y accéder** : onboarding complet → signup mock → home J1
**Texte overlay** : "Sept actions. Cinq sur sept valident ta journée."
**Pourquoi** : montre le coeur fonctionnel app

### 3.3 — Charnière J3
**Nom fichier** : `03-charniere-j3.png`
**Comment y accéder** : Profil DEV → "Aller au jour 3" → valider une action → charnière s'affiche
**Texte overlay** : "Trois jours, et ton corps répond."
**Pourquoi** : montre dimension narrative

### 3.4 — Palier 7 jours + charnière J7 (fusion Sprint 31)
**Nom fichier** : `04-palier-7j.png`
**Comment y accéder** : DEV "Aller au jour 7 (palier)" → valide jour → modale palier
**Texte overlay** : "Une semaine. Tu as tenu."
**Pourquoi** : montre récompense + paliers

### 3.5 — Charnière J14 — Bilan
**Nom fichier** : `05-charniere-j14.png`
**Comment y accéder** : DEV "Aller au jour 14" → valide → charnière
**Texte overlay** : "Quatorze jours. Champion de ta vie."
**Pourquoi** : montre arrivée Phase 0 victorieuse

### 3.6 — S0.1 Toile révélée
**Nom fichier** : `06-toile-s01.png`
**Comment y accéder** : DEV "Aller au jour 15 (S0.1)" → écran S0.1
**Texte overlay** : "Ta vitalité, en huit branches."
**Pourquoi** : montre score vitalité unique brand

### 3.7 — Pilier S1 Respiration (éval ou session)
**Nom fichier** : `07-pilier-s1.png`
**Comment y accéder** : DEV "S1 — Jour 1" → écran session cohérence cardiaque
**Texte overlay** : "Huit semaines, huit piliers."
**Pourquoi** : montre Phase 1 valeur abonnement

### 3.8 — Profil + paliers galerie
**Nom fichier** : `08-profil.png`
**Comment y accéder** : onglet Profil → "Voir mes paliers"
**Texte overlay** : "Ta progression, jour après jour."
**Pourquoi** : montre engagement long-terme

---

## 4. Capture process

### 4.1 Prérequis

- iPhone 17 Pro Max simulator booté (UUID `F6A99451-FEF4-4229-8C40-C012B1F0DD47`)
- App `world.rawadventure.app` installée + lancée
- Reset complet effectué pour partir d'un état propre

### 4.2 Script capture

`scripts/capture-screenshots.sh` :
```bash
./scripts/capture-screenshots.sh <screen_name>
# Ex : ./scripts/capture-screenshots.sh 01-splash
```

Sauvegarde dans `assets/store-screenshots/iphone-6.9/<screen_name>.png`.

### 4.3 Process complet

```bash
# 0. Reset complet via Profil DEV
# Navigate via Profil tab → DEV buttons

# 1. Splash
# Reset → app relancée → première seconde du launch
./scripts/capture-screenshots.sh 01-splash

# 2. Phase 0 Home J1
# Onboarding complété → signup → home
./scripts/capture-screenshots.sh 02-phase0-home

# 3. Charnière J3
# DEV "Aller au jour 3" → valider une action → charnière apparaît
./scripts/capture-screenshots.sh 03-charniere-j3

# 4. Palier 7j
# DEV "Aller au jour 7 (palier)" → valider
./scripts/capture-screenshots.sh 04-palier-7j

# 5. Charnière J14
# DEV "Aller au jour 14" → valider
./scripts/capture-screenshots.sh 05-charniere-j14

# 6. Toile S0.1
# DEV "Aller au jour 15 (S0.1)"
./scripts/capture-screenshots.sh 06-toile-s01

# 7. Pilier S1
# DEV "S1 — Jour 1"
./scripts/capture-screenshots.sh 07-pilier-s1

# 8. Profil
# Onglet Profil → scroll → "Voir mes paliers"
./scripts/capture-screenshots.sh 08-profil
```

### 4.4 Vérif résolutions

```bash
for f in assets/store-screenshots/iphone-6.9/*.png; do
  python3 -c "from PIL import Image; im = Image.open('$f'); print(f'$(basename $f): {im.size[0]}x{im.size[1]}')"
done
```

Attendu : toutes `1320×2868`.

---

## 5. Post-production marketing overlay

Captures brutes V1 = utilisable pour TestFlight beta.

Pour submit App Store final : ajout overlay marketing dans **Figma** ou **Canva** :

### Template overlay suggéré

- Texte marketing (headline) en haut, 80-120pt, Inter Bold
- Couleur : deep green `#2D3E33` ou cream `#F5F1E8` selon contraste
- Padding 60-80px autour
- Background : cream `#F5F1E8` ou portrait Mimi/Jacky discret

### Workflow

1. Mimi/Stéphane ouvre Figma
2. Import les 8 PNGs raw
3. Crée frame 1320×2868 par screenshot
4. Ajoute texte overlay selon §3
5. Export PNG haute qualité
6. Upload App Store Connect

---

## 6. Décision iPad

App.json actuel : `"supportsTablet": true`

**Options** :

**A. Garder support iPad** → besoin de 3 screenshots iPad Pro 13" (2064×2752)
- Plus de boulot capture
- Étend audience cible (~5% users iOS sur iPad)

**B. Retirer support iPad V1** → modifier `app.json` :
```json
"ios": {
  "supportsTablet": false
}
```
- Plus simple V1
- App App Store ne s'affichera pas sur iPad search
- Réactivable plus tard

**Reco V1** : **B** (retirer support iPad). Focus phone V1, ajout iPad post-launch si demande.

---

## 7. Workflow Google Play (post-capture iOS)

Une fois captures iPhone faites :
1. Resize/recadre pour ratio Android 9:16 (1080×1920) si besoin
2. Sauvegarde dans `assets/store-screenshots/android-phone/`
3. Reutilise textes overlay (cohérence cross-store)

**Feature graphic 1024×500** :
- À produire séparément via Canva
- Composition : portraits Mimi & Jacky + "Raw Adventure" + accroche
- Bg : cream avec touche deep green
- Drafter avec Mimi

---

## 8. Checklist captures

- [ ] Build app sur iPhone 17 Pro Max simulator
- [ ] Reset complet via Profil DEV
- [ ] 01-splash
- [ ] 02-phase0-home
- [ ] 03-charniere-j3
- [ ] 04-palier-7j
- [ ] 05-charniere-j14
- [ ] 06-toile-s01
- [ ] 07-pilier-s1
- [ ] 08-profil
- [ ] Vérif résolutions toutes en 1320×2868
- [ ] Décision support iPad
- [ ] Production overlays marketing (Mimi)
- [ ] Feature graphic Android (Mimi)
