---
title: Paiement confirmé
subtitle: Bienvenue dans la Phase 1.
permalink: /checkout-success/
---

<div style="text-align: center; padding: 40px 0;">

<h2 style="color: var(--brand-deep); margin-bottom: 16px;">Tu y es.</h2>

<p style="margin-bottom: 24px;">
  Ton abonnement est actif. Tu peux retourner dans l'application Raw Adventure — la Phase 1 t'attend.
</p>

<p style="margin-bottom: 16px;">
  <button id="back-to-app-btn" class="brand-cta" style="display: inline-block; padding: 14px 32px; background-color: var(--brand-deep); color: var(--brand-cream); text-decoration: none; border-radius: 8px; font-weight: 600; border: none; cursor: pointer; font-size: 16px;">
    Retourner dans l'app
  </button>
</p>

<p id="fallback-hint" style="font-size: 14px; color: var(--text-muted); display: none; margin-top: 16px;">
  Si l'app ne s'ouvre pas, ferme cette fenêtre (bouton × en haut) et relance Raw Adventure depuis ton écran d'accueil. Ton abonnement est déjà actif.
</p>

<p style="font-size: 14px; color: var(--text-muted); margin-top: 24px;">
  Si tu n'as pas Raw Adventure installée, télécharge-la sur ton App Store ou Play Store.
</p>

</div>

<script>
  // Tentative deep link rawadventure://subscription-success.
  // SFSafariViewController iOS bloque <a href="custom-scheme"> ; on contourne en
  // assignant window.location au tap (autorisé car gesture utilisateur).
  // Si l'app n'est pas installée OU si le scheme est bloqué, l'utilisateur voit
  // le hint de fallback après 1.5s.
  (function() {
    var btn = document.getElementById('back-to-app-btn');
    var hint = document.getElementById('fallback-hint');
    if (!btn) return;

    btn.addEventListener('click', function() {
      // Affiche le hint après délai si l'utilisateur n'a pas quitté la page
      // (= deep link a échoué).
      var timer = setTimeout(function() {
        if (hint) hint.style.display = 'block';
      }, 1500);

      // Si l'onglet passe en background (app prise focus → deep link OK),
      // annule le hint.
      var onHide = function() {
        if (document.hidden) {
          clearTimeout(timer);
          document.removeEventListener('visibilitychange', onHide);
        }
      };
      document.addEventListener('visibilitychange', onHide);

      // Lance la tentative de deep link.
      window.location.href = 'rawadventure://subscription-success';
    });
  })();
</script>

---

### Reçu

Tu recevras un email de confirmation et un reçu Stripe à l'adresse fournie lors du paiement. Si tu ne le vois pas, vérifie tes spams ou contacte [support@rawadventure.world](mailto:support@rawadventure.world).

### Gérer ton abonnement

Depuis l'app : Profil → Mon abonnement → Stripe Customer Portal.

Tu peux à tout moment changer de plan, mettre à jour ton moyen de paiement, télécharger tes factures, ou annuler.
