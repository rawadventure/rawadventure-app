---
title: Choisis ton plan
subtitle: Continue ton parcours Raw Adventure.
permalink: /abonnement/
---

<p style="margin-bottom: 24px;">
  Tes 14 premiers jours sont gratuits. Pour continuer la Phase 1 — huit semaines, huit piliers guidés par Mimi & Jacky — choisis la formule qui te convient.
</p>

<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
<div id="pricing-table-mount"></div>
<script>
  // Lit les query params depuis l'URL ouverte par PaywallScreen :
  //   rawadventure.world/abonnement/?user_id=XXXX&email=YYYY
  // et les passe au Stripe Pricing Table pour que le webhook puisse
  // identifier le user Supabase via client_reference_id.
  (function() {
    var params = new URLSearchParams(window.location.search);
    var userId = params.get('user_id');
    var email = params.get('email');

    var el = document.createElement('stripe-pricing-table');
    el.setAttribute('pricing-table-id', 'prctbl_1TfB5qQssbHmxKdShf85wu23');
    el.setAttribute('publishable-key', 'pk_test_51TenaZQssbHmxKdSxxARe4zajONAWvbgRcngNl5mxw6GVMP2mdRaiRb046XssJc7lJUu4zzHB5r90coJfhj6wwtn006DrEiU5B');
    if (userId) el.setAttribute('client-reference-id', userId);
    if (email) el.setAttribute('customer-email', email);

    document.getElementById('pricing-table-mount').appendChild(el);
  })();
</script>

---

### Trois questions fréquentes

**Je peux changer de plan plus tard ?**
Oui. Depuis ton Profil dans l'app → Mon abonnement → Stripe Customer Portal. Tu peux passer de mensuel à annuel à tout moment, ajuster le moyen de paiement, télécharger tes factures.

**Je peux annuler ?**
Oui. Annulation depuis Stripe Customer Portal. Tu gardes l'accès Phase 1 jusqu'à la fin de la période payée, puis le compte revient en accès Phase 0 gratuite. Ta progression reste sauvegardée.

**Et après les 8 semaines de Phase 1 ?**
Ton abonnement continue de te donner accès au contenu progressif Raw Adventure (consolidation libre, contenus bonus, futures phases). Pas de nouvel achat à faire.

---

Des questions ? Écris à [support@rawadventure.world](mailto:support@rawadventure.world).
