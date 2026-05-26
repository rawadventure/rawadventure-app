# Feature Spec — Abonnement IA-30 V1

**Statut** : À remplir
**Cible code** : refonte intégrale ConversionScreen (proto V0 supprimé Sprint 14 — IA-30 à coder from scratch)
**Cadrage** : IA V3 §IA-30 + D3 (conversion accessible dès J3) + D11 (1 tier 2 durées) + D33 (refonte M5)

## 1 — Décision technique : Stripe vs RevenueCat

### Reco Claude Code : RevenueCat

Pour app Expo iOS+Android avec in-app purchases, **RevenueCat** est la solution standard. Stripe seul ne gère pas natifs IAP iOS/Android (Apple/Google obligent par leurs stores).

### Trade-offs

| Critère | RevenueCat | Stripe (web only) |
|---|---|---|
| iOS IAP natif | ✅ wrapper officiel | ❌ |
| Android IAP natif | ✅ wrapper officiel | ❌ |
| Restore purchases | ✅ géré | ❌ |
| Webhooks unifiés | ✅ | ✅ |
| Coût | 0$ < 2,5k$ MRR puis 1% | 2,9% + 0,30€ par transaction |
| Expo compat | ✅ `react-native-purchases` | ⚠️ web seul ou WebView |

**Décision** : [à compléter — RevenueCat probable]

## 2 — Grille de prix

### Mensuel

- **Prix** : [à compléter]
- **Période d'engagement** : aucune (résiliation à tout moment)
- **Renouvellement** : auto, mensuel

### Annuel

- **Prix** : [à compléter]
- **Économie** vs 12× mensuel : [à compléter — typiquement -20 à -30%]
- **Renouvellement** : auto, annuel

### Trial

- **Trial gratuit ?** : [à compléter — oui/non]
- **Durée** : [à compléter — 7j ? 14j ?]
- **Note** : Phase 0 est déjà gratuite 14j — donc trial supplémentaire à arbitrer (D3 acté : pas de "lock" Phase 1 avant J15)

## 3 — Flow paiement

### Entry points (cf. IA V3 §IA-30 — multiples entry points)

- Bouton "S'abonner" persistant Accueil dès J3 (D3)
- CTA dans contenu bonus (Phase 1 déblocage)
- Profil → Mon abonnement
- Modale upsell après éval initiale S1 ?

### Étapes flow

1. Tap CTA "S'abonner" → ouvre `IA-30` modale
2. Présentation offre + pricing
3. Tap "S'abonner mensuel" ou "S'abonner annuel" → flow IAP natif (Apple Pay / Google Pay)
4. Confirmation système → callback success
5. `IA-31` modale confirmation post-abonnement
6. Retour écran d'origine, état abonnement actif

## 4 — Copy IA-30

### Modale principale

- **Titre** : [à compléter]
- **Subtitle** : [à compléter]
- **Bénéfices (3-5 puces)** :
  - [à compléter]
- **Rappel pédagogique** (visible si entry J3-J14) : [à compléter — actuel placeholder "Les 14 jours sont calibrés pour que ton corps installe les bases avant qu'on isole un pilier — tu ne perds pas de temps, tu construis."]
- **Prix mensuel** : [à compléter copy]
- **Prix annuel** : [à compléter copy]
- **CTA1** : `S'abonner mensuel`
- **CTA2** : `S'abonner annuel`
- **CTA3** : `Pas maintenant` (ferme modale)
- **Mentions légales** : [à compléter — auto-renouvellement, possibilité d'annuler, CGU]

### Confirmation post-abonnement (IA-31)

- **Titre** : [à compléter]
- **Body** : [à compléter]
- **CTA** : `Continuer` (retour Accueil)

## 5 — Gestion churn

### Modale annulation abonnement

Ouverte depuis IA-71 (gestion abonnement).

- **Titre** : [à compléter — ex : "Avant de partir"]
- **Body** : [à compléter — pas culpabilisant, rappel ce que l'utilisateur perd]
- **CTA1** : `Continuer mon abonnement` (annule annulation)
- **CTA2** : `Confirmer l'annulation` (effective fin période payée)

### Texte fenêtre churn (court — D3 non punitif)

- [à compléter]

## 6 — État abonnement expiré

Quand abonnement annulé + période payée terminée → utilisateur retombe en "mode anonyme étendu" :

- Accès historique : [oui/non — à compléter]
- Accès Toile : [à compléter]
- Streak conservé : [à compléter — affichage uniquement, pas de poursuite ?]
- CTA "Re-souscrire" visible où ? : [à compléter]
- Mentorat : [à compléter]

## 7 — Côté code — impact intégration

Quand Feature Spec validée, Claude Code livrera :
1. Setup RevenueCat (deps + config app + entitlements)
2. Refonte `IA-30` ConversionScreen V1
3. Hook `useSubscription()` (status actif/expiré/trial)
4. Gating Phase 1 → si pas abo et J15+ → IA-30 obligatoire (à confirmer Feature Spec)
5. `IA-71` écran gestion abonnement
6. `IA-31` modale confirmation post-abo
7. Webhook serveur côté Supabase Edge Function (RevenueCat → maj `profiles.subscription_status`)
8. Tests purchase sandbox iOS + Android

Charge estimée : **8-12h Claude Code** une fois spec validée.
