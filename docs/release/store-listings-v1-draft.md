# Drafts descriptions stores — App Store + Play Store V1

**Date** : 5 juin 2026
**Statut** : Drafts Claude — à valider Mimi avant submission
**Contrainte critique** : Conformité Reader App pattern (Apple §3.1.3(a)). Aucune mention de prix, d'abonnement, de paiement, de Stripe, de "souscrire", "acheter" dans le copy des stores. La monétisation hors-app est légale mais ne doit pas être promue dans les listings.

---

## 1. Métadonnées techniques (commun stores)

| Champ | Valeur |
|---|---|
| App name | **Raw Adventure** |
| Bundle ID iOS | `world.rawadventure.app` |
| Package Android | `world.rawadventure.app` |
| Catégorie primaire | Santé & Forme (`Health & Fitness`) |
| Catégorie secondaire | Style de vie (`Lifestyle`) |
| Langue principale | Français |
| Pays disponibilité | France + UE en V1, monde après validation |
| Âge requis | 17+ (santé/wellness, recommandations alimentaires) |
| Support URL | https://rawadventure.world |
| Privacy URL | https://rawadventure.world/politique-confidentialite |
| Marketing URL | https://rawadventure.world (V1) |

---

## 2. App Store iOS

### 2.1 Subtitle (max 30 caractères)

Affiché sous le nom de l'app. Doit être informatif + accrocheur.

**Draft validé pour Reader App** :
```
Reviens à toi en 14 jours
```
(24 chars)

**Alternatives** :
```
Ta vitalité, jour après jour
```
(28 chars)

```
Coaching santé naturelle
```
(24 chars)

### 2.2 Promotional Text (max 170 caractères)

Modifiable post-launch sans re-submission. Mise à jour saisonnière OK.

```
14 jours pour préparer ton corps. 8 semaines guidées par Mimi & Jacky. Respiration, alimentation, mouvement, repos, mindset. Le ressenti avant la théorie.
```
(160 chars)

### 2.3 Description (max 4000 caractères, draft ~1500)

```
Raw Adventure est un parcours de santé naturelle guidé par Mimi & Jacky. Pas un programme de coaching expressif. Pas une bibliothèque de contenus à parcourir seul. Un chemin, jour après jour, pour ressentir ta vitalité plutôt que la lire.

— Comment ça marche

Phase 0 — Tes 14 premiers jours. Sept actions simples à essayer chaque jour : activation matinale, exposition au froid, mouvement ou récupération, minéralisation, fenêtre digestive, fruits, soirée sans écrans. Cinq actions sur sept suffisent pour valider ta journée. Le joker est là pour les jours difficiles.

Au bout de deux semaines, tu n'as pas suivi un cours. Tu as fait. Ton corps a reçu des signaux. Quelque chose a bougé.

Phase 1 — Huit semaines, huit piliers. Une semaine consacrée à la respiration. Une à l'alimentation. Mindset, mouvement, repos, passion, connexion au vivant, élimination. Chaque pilier est isolé pour que tu sentes son effet sans bruit autour.

— Ce que tu trouves dans l'app

Un parcours guidé jour par jour, sans choix complexe à faire.
Des évaluations 12 questions pour mesurer où tu en es à chaque pilier.
Une toile de vitalité personnelle qui révèle tes huit branches au fil des semaines.
Des sessions courtes — moins d'une minute par jour en routine.
Des vidéos pré-enregistrées de Mimi & Jacky pour chaque étape clé.
Six paliers de progression : 7, 15, 30, 60, 100 jours, un an.

— Notre approche

Le ressenti prime sur la théorie. Avant d'expliquer, on fait vivre.
La régularité avant l'intensité. La constance change tout, l'effort ponctuel ne change rien.
Pas de marketing wellness creux. Du contenu dense, des phrases qui apportent quelque chose.
Tu ne dois pas réfléchir. Tu dois être guidé. Le check quotidien prend moins d'une minute.

— Pour qui

Tu sens que ton énergie a baissé sans savoir d'où vient la fuite.
Tu as essayé plein d'apps santé, aucune n'a tenu plus d'une semaine.
Tu cherches une méthode crédible, pas un coach Instagram.
Tu veux ressentir une différence dans ton corps, pas accumuler des badges.

— Important — avertissement médical

Raw Adventure est un programme d'éducation à la santé naturelle. Les contenus ne constituent ni un diagnostic, ni un traitement, ni un avis médical. L'application ne se substitue pas à l'avis d'un professionnel de santé.

Consulte un professionnel avant de pratiquer en cas de pathologie chronique, grossesse, traitement médicamenteux, troubles cardiaques ou respiratoires, ou toute condition particulière.

— Contact

support@rawadventure.world
https://rawadventure.world
```

**Note Reader App** : pas de mention prix/abonnement/Stripe. Conforme §3.1.3(a). L'app gratuite couvre Phase 0 14 jours, paywall web externe pour Phase 1+.

### 2.4 Keywords (max 100 caractères, séparés virgules)

Stratégie : densité métiers + intention utilisateur. Pas de marque concurrente.

```
santé,vitalité,respiration,alimentation,sommeil,mouvement,bien-être,nature,énergie,équilibre
```
(99 chars)

### 2.5 Categories

- **Primary** : Health & Fitness
- **Secondary** : Lifestyle

### 2.6 Age Rating

17+ ou 12+ selon questionnaire Apple :
- Health/wellness content : Frequent/Intense → 17+
- Recommandations alimentaires : Infrequent/Mild → 12+
- Suggéré V1 : **17+** par prudence (protocole jeûne, exposition froid, etc.)

### 2.7 In-App Purchases

**Aucun.** Reader App pattern : paiement externe Stripe non géré in-app.

### 2.8 Screenshots iOS — Brief

Tailles requises minimum :
- 6.7" (iPhone Pro Max) : 1290×2796
- 6.5" (iPhone Plus) : 1242×2688

5 à 10 screenshots par taille. Ordre recommandé :

1. **Splash/Hero** : "Reviens à toi en 14 jours" sur fond cream + logo
2. **Phase 0 Home** : 7 actions + streak, "Coche ce que tu as fait aujourd'hui"
3. **Charnière J7** : "Une semaine. Tu as tenu."
4. **Toile d'araignée** : score vitalité 8 branches révélé S0.1
5. **Pilier S1 Respiration** : session 3 niveaux d'intensité
6. **Évaluation 12 questions** : interface clean Likert 1-5
7. **Vidéo intro Mimi & Jacky** : capture vidéo pilier (placeholder OK V1)
8. **Profil** : streak, paliers, parcours actuel

Concept visuel : sobre, brand cream/deep green, texte minimal incrusté. Format mockup iPhone réel.

Production : sortie dev build iOS + capture simulator + retouche Figma/Canva avec overlay marketing.

---

## 3. Play Store Android

### 3.1 Short description (max 80 caractères)

```
Reviens à toi en 14 jours. Parcours santé naturelle guidé.
```
(58 chars)

### 3.2 Full description (max 4000 caractères, ~1800)

```
Raw Adventure est un parcours de santé naturelle guidé par Mimi & Jacky. Un chemin jour après jour pour ressentir ta vitalité plutôt que la lire.

🌱 Phase 0 — Tes 14 premiers jours, gratuits

Sept actions simples à essayer chaque jour :
• Activation matinale
• Défi froid
• Mouvement ou récupération
• Minéralisation
• Fenêtre digestive
• Fruits
• Soirée sans écrans

Cinq actions sur sept suffisent pour valider ta journée. Le joker est là pour les jours difficiles.

Au bout de deux semaines, tu n'as pas suivi un cours. Tu as fait. Ton corps a reçu des signaux. Quelque chose a bougé.

🌿 Phase 1 — Huit semaines, huit piliers

Une semaine consacrée à la respiration. Une à l'alimentation. Mindset, mouvement, repos, passion, connexion au vivant, élimination. Chaque pilier est isolé pour que tu sentes son effet sans bruit autour.

📊 Ce que tu trouves dans l'app

• Un parcours guidé jour par jour, sans choix complexe à faire
• Des évaluations 12 questions pour mesurer où tu en es à chaque pilier
• Une toile de vitalité personnelle qui révèle tes huit branches
• Des sessions courtes — moins d'une minute par jour en routine
• Des vidéos pré-enregistrées de Mimi & Jacky pour chaque étape clé
• Six paliers de progression : 7, 15, 30, 60, 100 jours, un an

🌾 Notre approche

Le ressenti prime sur la théorie. Avant d'expliquer, on fait vivre.

La régularité avant l'intensité. La constance change tout, l'effort ponctuel ne change rien.

Pas de marketing wellness creux. Du contenu dense, des phrases qui apportent quelque chose.

Tu ne dois pas réfléchir. Tu dois être guidé. Le check quotidien prend moins d'une minute.

🧭 Pour qui

Tu sens que ton énergie a baissé sans savoir d'où vient la fuite.
Tu as essayé plein d'apps santé, aucune n'a tenu plus d'une semaine.
Tu cherches une méthode crédible, pas un coach Instagram.
Tu veux ressentir une différence dans ton corps, pas accumuler des badges.

⚠️ Avertissement médical important

Raw Adventure est un programme d'éducation à la santé naturelle. Les contenus ne constituent ni un diagnostic, ni un traitement, ni un avis médical. L'application ne se substitue pas à l'avis d'un professionnel de santé.

Consulte un professionnel avant de pratiquer en cas de pathologie chronique, grossesse, traitement médicamenteux, troubles cardiaques ou respiratoires, ou toute condition particulière.

📬 Contact

support@rawadventure.world
https://rawadventure.world
```

**Note** : Play Store autorise emojis dans descriptions contrairement à App Store. Garder lecture sobre, max 8-10 emojis section headers.

### 3.3 Screenshots Android — Brief

Tailles minimum :
- Phone : 1080×1920 (16:9 vertical)
- 7" Tablet (recommandé) : 1200×1920

2 phones + 1 tablet minimum. Recommandé 4-8 screenshots phone.

Même contenu que iOS (cf §2.8), juste retouches dimensions.

### 3.4 Feature graphic

1024×500 PNG/JPG. Affiché en tête de page Play Store.

Brief : composition horizontale avec portraits Mimi & Jacky + texte "Raw Adventure" + accroche "Reviens à toi en 14 jours" + fond brand cream/deep green.

À produire par Mimi via ChatGPT/Canva ou freelance.

### 3.5 Content rating

Questionnaire Google PEGI :
- Violence : Aucune
- Sexual content : Aucun
- Profanity : Aucun
- Controlled substance : Aucun (pas de drogue, attention si jeûne intermittent peut être catégorisé "extreme")
- User-generated content : Non
- Web browsing : Oui (lien externe Stripe)
- Digital purchases : Non (Reader App externe, pas IAP)

Résultat probable : **PEGI 12** ou **PEGI 16** selon nuance jeûne/froid.

### 3.6 Data safety form

Stéphane remplit le Data Safety form Play Console :

| Donnée | Collectée | Partagée | Optional | Linked to identity |
|---|---|---|---|---|
| Email | ✅ | ❌ | ❌ obligatoire | ✅ |
| Mot de passe | ✅ (chiffré) | ❌ | ❌ | ✅ |
| Health info (auto-déclaré questionnaires) | ✅ | ❌ | ✅ | ✅ |
| App activity (streak, sessions) | ✅ | ❌ | ❌ | ✅ |
| Device ID | ✅ | ❌ | ❌ | ✅ |
| Payment info | ❌ (géré Stripe externe) | ❌ | - | - |

Encryption in transit : ✅
Data deletion : ✅ (sur demande à support@)

---

## 4. Validation Mimi requise

Avant submission stores :

- [ ] Subtitle iOS validé Mimi
- [ ] Promotional text iOS validé Mimi
- [ ] Description longue validée Mimi (FR brand voice cohérente)
- [ ] Short description Android validée Mimi
- [ ] Keywords iOS validés (recherche métier acceptable)
- [ ] Mention avertissement médical validée (formulation)
- [ ] Feature graphic Android produit + validé
- [ ] Screenshots produits + validés

---

## 5. Notes Reader App pattern (rappel critique)

L'app Raw Adventure utilise le pattern Apple "Reader App" : la monétisation est gérée hors-app via Stripe Payment Link web. Apple §3.1.3(a) autorise ce pattern pour les apps de contenu à abonnement, **à condition que** :

1. ❌ **Aucun bouton/CTA d'achat** in-app
2. ❌ **Aucun prix affiché** in-app
3. ❌ **Aucune mention** des plans tarifaires
4. ✅ Lien externe générique autorisé ("Continue your journey")
5. ✅ Phase gratuite généreuse (14 jours suffit)

**Mêmes règles côté descriptions stores** :
- Pas de "14,99 €/mois", "abonnement", "souscrire", "Phase 1 payante"
- OK : "Tes 14 premiers jours gratuits", "Phase 1 — Huit semaines, huit piliers"
- OK : implicite que la suite existe sans dire que c'est payant

Si Apple repère du vocabulaire payant dans la description Store → rejection. Vérifier 2x avant submit.

---

## 6. Production assets restants

- [ ] Feature graphic Play 1024×500 (à produire Mimi/Canva)
- [ ] Screenshots iOS 6.7" + 6.5" (10 max chacun, dev build + retouche)
- [ ] Screenshots Android phone + tablette (mêmes contenus, ré-export)
- [ ] App preview video iOS (optionnel V1, 15-30s, marketing)
- [ ] Promo video Play (optionnel)

---

*Drafts à itérer avec Mimi avant submit App Store + Play Store.*
