# Stripe Credentials Raw Adventure Limited

**⚠️ NE PAS COMMITTER LES SECRET KEYS** (`sk_live_`, `sk_test_`)
**⚠️ Ce dossier est gitignored — secret keys vivent dans variables d'environnement Supabase Edge Function**

---

## Mode LIVE (production)

Setup créé le 5 juin 2026 par Stéphane + Mimi.

### Pricing Table embed code

```html
<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
<stripe-pricing-table
  pricing-table-id="prctbl_1TevYeQssbHmxKdSQJy3KjUE"
  publishable-key="pk_live_51TenaZQssbHmxKdSvWip4rasjDClQ84nWWmmdSx1Kz7dzH4e7b1fpVFsPdazDeW3ootZcOHHWbr8cQltbq7EVuHA00MDv2CQUN">
</stripe-pricing-table>
```

### Account

- **Stripe Account ID** : `acct_1TenaZQssbHmxKdS`
- **Publishable Key** : `pk_live_51TenaZQssbHmxKdSvWip4rasjDClQ84nWWmmdSx1Kz7dzH4e7b1fpVFsPdazDeW3ootZcOHHWbr8cQltbq7EVuHA00MDv2CQUN`
- **Secret Key** : à stocker en env var Supabase Edge Function (jamais en clair)
- **Pricing Table ID** : `prctbl_1TevYeQssbHmxKdSQJy3KjUE`

### Produit

- **Name** : `App Raw Adventure`
- **Product ID** : `prod_UeDWMtxdQ9f4XI`
- **Description** : Accès complet au parcours guidé Raw Adventure : Phase 1 (8 semaines de piliers) et suite.
- **Image** : portrait Mimi & Jacky

### Prix

| Plan | Prix | Période | Lookup Key | Price ID |
|---|---|---|---|---|
| Mensuel | 49,00 € | Monthly | `ra_monthly` | `price_xxx` (à récupérer) |
| 6 mois | 239,00 € | Every 6 months | `ra_semestrial` | `price_xxx` |
| Annuel | 399,00 € | Yearly | `ra_annual` | `price_xxx` |

### Config

- Codes promo : ON
- Adresse facturation : ON (TVA)
- Téléphone : OFF
- Tax ID : OFF
- Page de confirmation : redirect `https://rawadventure.world/checkout-success?session_id={CHECKOUT_SESSION_ID}`
- Customer Portal : "Autoriser les clients à modifier les produits" ON

---

## Mode TEST (dev + TestFlight beta)

Setup créé le 6 juin 2026 par Stéphane + Mimi.

### Pricing Table embed code

```html
<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
<stripe-pricing-table
  pricing-table-id="prctbl_1TfB5qQssbHmxKdShf85wu23"
  publishable-key="pk_test_51TenaZQssbHmxKdSxxARe4zajONAWvbgRcngNl5mxw6GVMP2mdRaiRb046XssJc7lJUu4zzHB5r90coJfhj6wwtn006DrEiU5B">
</stripe-pricing-table>
```

### Account

- **Pricing Table ID TEST** : `prctbl_1TfB5qQssbHmxKdShf85wu23`
- **Publishable Key TEST** : `pk_test_51TenaZQssbHmxKdSxxARe4zajONAWvbgRcngNl5mxw6GVMP2mdRaiRb046XssJc7lJUu4zzHB5r90coJfhj6wwtn006DrEiU5B`
- **Secret Key TEST** : à récupérer (`sk_test_...`) + stocker en env var Supabase Edge Function

### Cartes de test Stripe

| Scénario | Numéro carte |
|---|---|
| Paiement OK | `4242 4242 4242 4242` |
| 3D Secure requis | `4000 0025 0000 3155` |
| Refusée | `4000 0000 0000 0002` |
| Solde insuffisant | `4000 0000 0000 9995` |

Expiration : n'importe quelle future (ex `12/30`) — CVC : `123` — ZIP : `12345`

### Usage dev

L'app utilise cette pricing table pendant dev + TestFlight beta. Migration vers LIVE au launch App Store final = swap les 2 chaînes d'embed code dans la page `rawadventure.world/abonnement`.

### Webhook config (à faire post-creation)

URL endpoint : `https://<TON_PROJET>.supabase.co/functions/v1/stripe-webhook`

Events à écouter :
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

Signing secret : à stocker en env var `STRIPE_WEBHOOK_SECRET` côté Supabase Edge Function.
