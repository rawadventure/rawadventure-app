# Feature Spec — Abonnement Raw Adventure V1.0

**Date** : 2 juin 2026
**Statut** : V1.0 draft — décisions Mimi validées via questionnaire (session 1-2 juin 2026)
**Cadrage** : Feature Spec V1 socle minimum + roadmap contenu 2 ans
**Dépendances** : Stripe (paiement), Supabase (état abonnement), ProgressContext (gating)

---

## 1. Décisions cadre (validées Mimi)

| Sujet | Décision |
|---|---|
| Modèle | Freemium — Phase 0 (14j) gratuite, Phase 1+ payante |
| Trial | Phase 0 elle-même = essai gratuit 14 jours |
| Infra paiement | Stripe + lien externe (Reader App pattern Apple) |
| Paywall trigger | Fin Phase 0 — jour 14, avant S0.1 |
| Modèle long terme | Abonnement mensuel/annuel continu (pas one-shot) |
| Tarification | **49 €/mois**, **239 € / 6 mois** (19 %), **399 € / 12 mois** (32 %) |
| Lapse | Retour Phase 0 gratuite, progression Phase 1 gelée |
| Gating contenu | Déblocage à la complétion phase précédente (pas temporel) |
| Stores | App gratuite, paywall externe web (Reader App rules) |
| Remboursement | Aucun (Phase 0 14j gratuit = trial suffisant) |
| Promo launch | Beta-testeurs gratuit/symbolique uniquement |

---

## 2. Pricing détaillé (validé Mimi)

| Formule | Prix total | €/mois équivalent | Économie vs mensuel |
|---|---|---|---|
| 1 mois | 49 € | 49 € | — |
| 6 mois | **239 €** | 39,83 € | **19 %** |
| 12 mois | **399 €** | 33,25 € | **32 %** |

**Logique** :
- Gap 6m → 12m fort (19 % → 32 %) = incitation annuel
- Seuils psychologiques sous 240 € et 400 €
- Référence retail 588 €/an (49 × 12)

**À trancher Mimi** :
- Renouvellement auto vs manuel à échéance
- Notification renouvellement J-7 / J-3 / J-1

---

## 3. Reader App pattern (Apple/Google)

### Principe

L'app reste **100 % gratuite** sur les stores. Le paiement se fait **hors-app** via un lien web Stripe Checkout. L'app valide ensuite le statut abonné via Supabase.

### Règles Apple Reader App (conformité)

- ✅ Lien externe autorisé vers site web de souscription
- ✅ Mention "Gérer mon abonnement" autorisée
- ❌ Pas de bouton "Acheter" ou "S'abonner" direct dans l'app
- ❌ Pas de prix affiché dans l'app
- ✅ Message neutre type "Pour continuer, terminez votre inscription sur rawadventure.world"

### Implémentation

1. Paywall in-app affiche message + CTA "Continuer mon parcours" (pas "Payer")
2. CTA ouvre WebBrowser (`expo-web-browser`) sur **Stripe Payment Link** dédié (URL fournie par Stripe)
3. Stripe Payment Link gère checkout (3 produits : mensuel 49 €, 6 mois 239 €, 12 mois 399 €)
4. Webhook Stripe → Supabase Edge Function → update `profiles.subscription_status`
5. Retour app via deep link `rawadventure://subscription-success`
6. App re-fetch `subscription_status`, débloque Phase 1

---

## 4. États abonnement

### 4.1 Source de vérité — Supabase

Table `subscriptions` (ou colonnes sur `profiles`) :

```sql
subscription_status: 'free' | 'trial' | 'active' | 'past_due' | 'cancelled' | 'expired'
subscription_plan: 'monthly' | 'semestrial' | 'annual' | null
subscription_started_at: timestamptz | null
subscription_renews_at: timestamptz | null
subscription_cancelled_at: timestamptz | null
stripe_customer_id: text | null
stripe_subscription_id: text | null
```

### 4.2 Mapping état → accès app

| État | Accès Phase 0 | Accès Phase 1+ | UI |
|---|---|---|---|
| `free` | ✅ | ❌ paywall | Bandeau "Essai gratuit Phase 0" |
| `trial` (J1-J14 Phase 0) | ✅ | ❌ pré-paywall | Compteur jours restants |
| `active` | ✅ | ✅ | Aucun bandeau |
| `past_due` | ✅ | ⚠️ grace 7j | Bandeau "Paiement en attente" |
| `cancelled` | ✅ | ✅ jusqu'à `renews_at` | Bandeau "Annulé — fin le X" |
| `expired` | ✅ | ❌ gelé | Paywall + "Reprendre où tu en étais" |

### 4.3 ProgressContext extension

```ts
type SubscriptionState = {
  status: SubscriptionStatus;
  plan: SubscriptionPlan | null;
  renewsAt: Date | null;
  isActive: boolean; // status === 'active' || 'cancelled' (jusqu'à renewsAt)
  isInTrial: boolean; // Phase 0 jour 1-14
};
```

---

## 5. Paywall fin Phase 0 (jour 14)

### 5.1 Trigger

- Déclenché quand `currentDay === 14` et fin de la dernière action Phase 0 validée
- Bloque la transition vers S0.1 (jour 15)

### 5.2 Écran paywall

**Pattern UI** : modal plein écran, non-dismissable.

**Contenu** (copy à valider Mimi) :
- Titre : *"Tu as terminé la Phase 0."*
- Sous-titre : *"14 jours pour préparer ton corps. La suite commence maintenant."*
- Récap : streak Phase 0 + branches Toile éveillées
- CTA principal : "Continuer mon parcours" → ouvre WebBrowser sur Stripe Payment Link
- CTA secondaire : "Plus tard" → ferme app, revient à Phase 0 lecture seule
- Mention légale : conditions, RGPD, lien CGU

**Pas affiché dans l'app** (Reader App) :
- Prix
- Bouton "S'abonner" / "Payer"
- Mention "abonnement"

### 5.3 Retour de paiement

- Deep link `rawadventure://subscription-success` → toast confirmation + débloque S0.1
- Si échec ou abandon : retour app sans changement, paywall réapparaît au prochain launch

---

## 6. Écran gestion abonnement (Profil)

Accessible depuis `ProfilTabScreen` → nouvelle entrée "Mon abonnement".

### 6.1 Affichage

- État actuel (Phase 0 trial / Actif / Annulé / Expiré)
- Plan en cours (mensuel / 6 mois / 12 mois)
- Date prochain renouvellement
- Bouton "Gérer mon abonnement" → WebBrowser vers Stripe Customer Portal
- Bouton "Aide" → email support

### 6.2 Stripe Customer Portal

URL : `https://billing.stripe.com/p/login/{portal_id}` avec session pré-créée via Edge Function.

Permet : changer de plan, annuler, mettre à jour CB, télécharger factures.

---

## 7. Lapse — comportement détaillé

### 7.1 Quand `active` → `expired` (paiement échoué ou annulation arrivée à terme)

- Phase 1+ : sessions verrouillées, écrans grisés avec icône cadenas
- Évaluations en cours : sauvegardées, accessibles en lecture seule
- Progression : gelée (currentDay, completedPilliers, streak persistent)
- Phase 0 : accès complet maintenu
- Home : bascule sur ConsolidationHomeScreen variant `expired` OU Phase 0 home selon contexte

### 7.2 Re-souscription

- Bouton "Reprendre mon parcours" visible partout
- Au paiement réussi → bascule directe sur le jour où user s'était arrêté
- Aucune perte de données

---

## 8. Roadmap 2 ans — contenu progressif

### 8.1 Principe

User actif paie pour accéder à un parcours progressif sur 2 ans :
- **Phase 1** : 8 piliers / 8 semaines (livré V1)
- **Phase 2-N** : à définir (suite Jacky) — contenu mensuel ou trimestriel

### 8.2 Gating

Chaque phase se débloque à la **complétion de la précédente** (pas de gating temporel).

Exemple : Phase 2 jour 1 accessible seulement si Phase 1 jour 56 validé.

### 8.3 Upsell mentorat humain

Hors-scope V1 abonnement. À chaque fin de phase :
- Proposition mentorat humain (IA-60/61) en option premium séparée
- Tarif/format à définir avec Jacky
- Pas inclus dans abonnement standard

---

## 9. Implémentation V1 — périmètre code

### 9.1 In-scope V1

1. **Table Supabase** `subscriptions` + RLS policies
2. **Webhook Stripe → Edge Function** `stripe-webhook.ts` (events : `customer.subscription.created/updated/deleted`, `invoice.paid`, `invoice.payment_failed`)
3. **Stripe Payment Link** (V1) — 3 produits config dashboard Stripe, pas de site custom
4. **`SubscriptionContext`** ou extension `ProgressContext` avec état abonnement
5. **`PaywallScreen.tsx`** modal fin Phase 0
6. **Deep link handler** `rawadventure://subscription-success`
7. **`SubscriptionManagementScreen.tsx`** dans ProfilStack
8. **Gating Phase 1** : `SessionScreen` + `PillarOverviewScreen` check `isActive`
9. **Notifications** renouvellement J-7, échec paiement (via webhook + push)
10. **Bandeau global** état lapse / past_due

### 9.2 Hors-scope V1 (différé)

- Pricing dynamique / A/B test prix
- Codes promo grand public
- Parrainage user → user
- Pause d'abonnement
- Family / Team plans
- Upsell mentorat humain
- Phase 2+ contenu

---

## 10. Stratégie stores (Reader App)

### 10.1 Description app stores

- Titre : *"Raw Adventure — Parcours santé 14j gratuit"*
- Description : insiste sur **Phase 0 14 jours gratuits**, pas sur abonnement
- Aucune mention de prix
- Aucune capture d'écran montrant paywall ou bouton paiement

### 10.2 Risques

- **Apple peut rejeter** si interprétation stricte. Mitigation : message paywall ultra-neutre, aucun CTA explicite vers paiement.
- **Conversion plombée** vs IAP natif (~30-50 % conversion en moins selon benchmarks). À surveiller post-launch.
- **Plan B** : migrer vers RevenueCat + IAP si conversion trop faible (Feature Spec V2 abonnement).

---

## 11. Edge cases

- **User crée compte mais ne complète jamais Phase 0** : reste `free`, paywall jamais déclenché. OK.
- **User paye puis demande remboursement** : refus selon politique (Phase 0 = trial). Cas exceptionnels via support Mimi.
- **Carte expirée mid-abonnement** : `past_due` 7 jours grace, puis `expired`. Email Stripe auto + push notif.
- **Changement de plan mid-période** : Stripe prorate, géré côté portal client.
- **User désinstalle/réinstalle** : compte Supabase persistant, état abonnement reconstruit au login.
- **Mineur** : Phase 0 accessible, paiement refusé (CGU 18+ ou autorisation parentale à valider légal).

---

## 12. Validation requise

| Sujet | Validateur |
|---|---|
| Copy paywall fin Phase 0 | Mimi |
| Copy bandeaux lapse / past_due | Mimi |
| Conformité légale CGU 18+ / mineurs | Avocat / RGPD |
| Stratégie marketing app store description | Mimi |

---

## 12bis. Décisions infra validées (2 juin 2026)

| Sujet | Décision |
|---|---|
| Site checkout | **Stripe Payment Link** (pas de site custom V1) |
| Compte Apple Developer | **Organization** — société HK |
| DUNS Number | À demander via https://developer.apple.com/enroll/duns-lookup/ (gratuit, délai 5j-2sem) |
| Domaine | **rawadventure.world** (déjà possédé) |
| Email support | **support@rawadventure.world** via Proton Mail Business (custom domain) |
| Deep link scheme | `rawadventure://` |

---

## 13. Métriques à tracker (V1.5)

- Taux complétion Phase 0 (J14 atteint)
- Taux affichage paywall (J14 atteint sans abonnement)
- Taux clic CTA paywall
- Taux conversion checkout (clic → paiement réussi)
- Répartition plan (mensuel / 6m / 12m)
- Taux churn mensuel
- Taux re-souscription après lapse
- LTV moyen par plan

---

## 14. Prochaines étapes

1. **Mimi** : valider copy paywall + copy bandeaux lapse
2. **Stéphane** : créer compte Stripe + 3 produits (49 € / 239 € / 399 €) + Payment Link
3. **Stéphane** : lancer demande DUNS Apple (parallèle, délai 5j-2sem)
4. **Stéphane** : ajouter custom domain rawadventure.world à Proton Mail + créer `support@`
5. **Stéphane** : démarrer inscription Apple Developer Organization (HK) une fois DUNS reçu
6. **Dev** : implémenter périmètre §9.1 (Sprint dédié)
7. **Stéphane** : valider conformité App Store via TestFlight beta avant submit

---

*Fin Feature Spec abonnement V1.0.*
