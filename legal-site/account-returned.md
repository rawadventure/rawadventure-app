---
title: Modifications enregistrées
subtitle: Tu peux retourner dans l'app.
permalink: /account-returned/
---

<div style="text-align: center; padding: 40px 0;">

<h2 style="color: var(--brand-deep); margin-bottom: 16px;">C'est fait.</h2>

<p style="margin-bottom: 24px;">
  Les modifications de ton abonnement sont enregistrées. Tu peux retourner dans l'application Raw Adventure — tout sera à jour.
</p>

<p style="margin-bottom: 16px;">
  <button id="back-to-app-btn" class="brand-cta" style="display: inline-block; padding: 14px 32px; background-color: var(--brand-deep); color: var(--brand-cream); text-decoration: none; border-radius: 8px; font-weight: 600; border: none; cursor: pointer; font-size: 16px;">
    Retourner dans l'app
  </button>
</p>

<p id="fallback-hint" style="font-size: 14px; color: var(--text-muted); display: none; margin-top: 16px;">
  Si l'app ne s'ouvre pas, ferme cette fenêtre (bouton × en haut) et relance Raw Adventure depuis ton écran d'accueil. Les changements sont déjà appliqués.
</p>

</div>

<script>
  (function() {
    var btn = document.getElementById('back-to-app-btn');
    var hint = document.getElementById('fallback-hint');
    if (!btn) return;

    btn.addEventListener('click', function() {
      var timer = setTimeout(function() {
        if (hint) hint.style.display = 'block';
      }, 1500);

      var onHide = function() {
        if (document.hidden) {
          clearTimeout(timer);
          document.removeEventListener('visibilitychange', onHide);
        }
      };
      document.addEventListener('visibilitychange', onHide);

      window.location.href = 'rawadventure://subscription-success';
    });
  })();
</script>
