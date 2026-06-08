# Stripe Customer Portal — Setup

**Date** : 8 juin 2026
**Status** : Code prêt, déploiement Edge Function + config Stripe Dashboard requis.

---

## Pourquoi

Sans Customer Portal, l'utilisateur ne peut pas annuler son abonnement, changer
de plan, mettre à jour son moyen de paiement ou récupérer ses factures
depuis l'app. **Bloquant App Store submission** (Apple §3.1.3 + §3.1.3(a)
exige que l'utilisateur puisse gérer son abonnement).

## Architecture

```
[ProfilTabScreen] → button "Gérer mon abonnement"
     ↓
[Edge Function stripe-portal] ← JWT user
     ↓
   lookup stripe_customer_id (subscriptions table)
     ↓
   stripe.billingPortal.sessions.create(customer, return_url)
     ↓
   { url: "https://billing.stripe.com/..." }
     ↓
[App] WebBrowser.openBrowserAsync(url)
     ↓
[Stripe Portal] user manages — cancel / change plan / payment / invoices
     ↓
[Stripe redirect] https://rawadventure.world/account-returned/
     ↓
[User] taps "Retourner dans l'app"
     ↓
[App] détecte close manuel → reload SubscriptionContext
[Stripe webhook] customer.subscription.updated → stripe-webhook function
     ↓
[Supabase row update] → Realtime push → app reflète
```

## Setup à faire — Stéphane

### 1. Stripe Dashboard — Customer Portal config

URL : `https://dashboard.stripe.com/test/settings/billing/portal`
(remplace `/test/` par `/live/` quand passage en production)

**Section "Features"** :
- ✅ Customers can update their **payment methods**
- ✅ Customers can update their **billing addresses**
- ✅ Customers can view their **invoice history**
- ✅ Customers can cancel **subscriptions**
  - Cancellation mode : "Cancel at end of billing period" (recommandé)
  - Optional reason : oui (collect feedback)
- ✅ Customers can switch to **other plans**
  - Add products : Raw Adventure Abonnement
  - Add prices : `ra_monthly`, `ra_semestrial`, `ra_annual` (tous les 3)
  - Allow proration : oui (Stripe calcule différence automatiquement)

**Section "Business information"** :
- Headline : "Gérer ton abonnement Raw Adventure"
- Privacy policy URL : `https://rawadventure.world/confidentialite/`
- Terms of service URL : `https://rawadventure.world/cgu/`

**Section "Branding"** (en haut, lien "Branding") :
- Color : `#3A2818` (brand-deep)
- Logo : upload icon Raw Adventure

**Save** (en haut à droite).

### 2. Déploiement Edge Function — Stéphane (Terminal)

```bash
cd /Users/ASUS/RawAdventureRN
supabase functions deploy stripe-portal --no-verify-jwt
```

Note : `--no-verify-jwt` car la function vérifie le JWT elle-même (via
`supabaseAdmin.auth.getUser(token)`) plutôt que via le middleware Supabase
qui rejetterait les tokens expirés sans message utile.

Vérif déploiement :
```bash
supabase functions list
# Doit afficher stripe-portal avec status ACTIVE
```

### 3. Test fonctionnel — toi + simu

1. App simu → login compte avec abonnement actif (`demo@rawadventure.world`
   après avoir mocké active monthly OR vrai test paiement)
2. Profil → Card "Mon abonnement" → button "Gérer mon abonnement"
3. SFSafariViewController s'ouvre sur `billing.stripe.com/...`
4. Vérif page affiche : moyen paiement, factures, plan actuel, options
   cancel / switch plan
5. (optionnel) Cancel subscription → confirmation
6. Tap "Retourner dans l'app" (bouton Stripe custom OR close X manuel)
7. App détecte close → reload SubscriptionContext
8. Si cancel : status passe à `cancelled`, app affiche bandeau

### 4. Validation webhook

Quand user cancel via portal :
- Stripe fire `customer.subscription.updated` avec `cancel_at_period_end: true`
- `stripe-webhook` function reçoit l'event
- handler `handleSubscriptionUpdated` :
  - `cancel_at_period_end: true` → status = 'cancelled'
  - met à jour `cancelled_at` ISO
- Supabase Realtime push → app reflète instantanément

Vérif logs : `https://supabase.com/dashboard/project/aknvitrtfxqjdwiyxryt/functions/stripe-webhook/logs`

## Gotchas

- **TEST vs LIVE** : le portail config est séparé entre test mode et live
  mode dans Stripe Dashboard. Refaire config pour LIVE quant prêt à
  passer en prod.
- **Return URL HTTPS only** : Stripe rejette `rawadventure://...` direct.
  D'où la page intermédiaire `rawadventure.world/account-returned/` avec JS
  fallback (comme `checkout-success`).
- **Test card 4242 ne génère pas cancellations** : pour tester cancel,
  pas besoin de card spécifique — utiliser n'importe quel abonnement
  TEST actif.
- **Permissions** : seul le user logged-in peut ouvrir SON portail (vérif
  JWT côté Edge Function + lookup stripe_customer_id par user_id du JWT).
  Pas de risque d'accès à un autre user.

## Trace audit

- Code : `supabase/functions/stripe-portal/index.ts`
- UI : `src/screens/v1/ProfilTabScreen.tsx` (handler `handleManageSubscription`)
- Page retour : `legal-site/account-returned.md`
- Webhook handler existant : `supabase/functions/stripe-webhook/index.ts`
  → `handleSubscriptionUpdated` (déjà gère cancel + plan changes)
