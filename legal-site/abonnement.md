---
title: Choisis ton plan
subtitle: Continue ton parcours Raw Adventure.
permalink: /abonnement/
---

<button type="button" id="back-to-app" style="display:inline-flex;align-items:center;gap:8px;background:none;border:none;padding:8px 0;margin-bottom:16px;font-size:16px;font-weight:600;color:#1F1147;cursor:pointer;">
  <span style="font-size:20px;line-height:1;">&#8592;</span> Retour à l'app
</button>
<script>
  // Retour à l'app depuis le checkout. Couvre les deux ouvertures :
  //  - même onglet (window.location.href) → history.back() ramène à l'app
  //  - nouvel onglet (window.open _blank) → window.close() ferme l'onglet Stripe
  // Fallback : si rien ne marche, renvoie vers l'accueil de l'app web.
  (function() {
    var btn = document.getElementById('back-to-app');
    if (!btn) return;
    btn.addEventListener('click', function() {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.close();
        // Si window.close est ignoré (onglet non ouvert par script), fallback.
        setTimeout(function() {
          window.location.href = 'https://rawadventure.world/';
        }, 150);
      }
    });
  })();
</script>

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
