---
title: Modifications enregistrées
subtitle: Tu peux retourner dans l'app.
permalink: /account-returned/
---

<div style="text-align: center; padding: 40px 0;">

<h2 style="color: var(--brand-deep); margin-bottom: 16px;">C'est fait.</h2>

<p style="margin-bottom: 24px;">
  Les modifications de ton abonnement sont enregistrées. Tu peux retourner dans Raw Adventure — tout sera à jour.
</p>

<p style="margin-bottom: 16px;">
  <button id="back-to-app-btn" class="brand-cta" style="display: inline-block; padding: 14px 32px; background-color: var(--brand-deep); color: var(--brand-cream); text-decoration: none; border-radius: 8px; font-weight: 600; border: none; cursor: pointer; font-size: 16px;">
    Retourner dans l'app
  </button>
</p>

<p id="fallback-hint" style="font-size: 14px; color: var(--text-muted); display: none; margin-top: 16px; max-width: 480px; margin-left: auto; margin-right: auto;">
  Si l'app ne s'ouvre pas, ferme cette fenêtre (bouton × en haut) et relance Raw Adventure depuis ton écran d'accueil. Les changements sont déjà appliqués.
</p>

<p id="desktop-hint" style="font-size: 14px; color: var(--text-muted); display: none; margin-top: 16px; max-width: 480px; margin-left: auto; margin-right: auto;">
  Reviens dans ton onglet ou ta fenêtre Raw Adventure — les changements sont déjà appliqués. Tu peux fermer cette page.
</p>

</div>

<script>
  /*
   * Même stratégie que checkout-success : détecte mobile vs desktop/PWA.
   * Mobile → tente deep link. Desktop/PWA → message direct (pas de scheme
   * dispo, on évite l'erreur "adresse invalide").
   */
  (function() {
    var btn = document.getElementById('back-to-app-btn');
    var hintMobile = document.getElementById('fallback-hint');
    var hintDesktop = document.getElementById('desktop-hint');
    if (!btn) return;

    var ua = navigator.userAgent || '';
    var isMobile = /Mobile|iPhone|iPad|iPod|Android/i.test(ua);

    btn.addEventListener('click', function() {
      if (!isMobile) {
        if (hintDesktop) hintDesktop.style.display = 'block';
        return;
      }

      var timer = setTimeout(function() {
        if (hintMobile) hintMobile.style.display = 'block';
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
