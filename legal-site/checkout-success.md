---
title: Paiement confirmé
subtitle: Bienvenue dans la Phase 1.
permalink: /checkout-success/
---

<div style="text-align: center; padding: 40px 0;">

<h2 style="color: var(--brand-deep); margin-bottom: 16px;">Tu y es.</h2>

<p style="margin-bottom: 24px;">
  Ton abonnement est actif. Tu peux retourner dans Raw Adventure — la Phase 1 t'attend.
</p>

<p style="margin-bottom: 16px;">
  <button id="back-to-app-btn" class="brand-cta" style="display: inline-block; padding: 14px 32px; background-color: var(--brand-deep); color: var(--brand-cream); text-decoration: none; border-radius: 8px; font-weight: 600; border: none; cursor: pointer; font-size: 16px;">
    Retourner dans l'app
  </button>
</p>

<p id="fallback-hint" style="font-size: 14px; color: var(--text-muted); display: none; margin-top: 16px; max-width: 480px; margin-left: auto; margin-right: auto;">
  Si l'app ne s'ouvre pas, ferme cette fenêtre (bouton × en haut) et relance Raw Adventure depuis ton écran d'accueil. Ton abonnement est déjà actif.
</p>

<p id="desktop-hint" style="font-size: 14px; color: var(--text-muted); display: none; margin-top: 16px; max-width: 480px; margin-left: auto; margin-right: auto;">
  Reviens dans ton onglet ou ta fenêtre Raw Adventure — ton abonnement est déjà actif. Tu peux fermer cette page.
</p>

<p style="font-size: 14px; color: var(--text-muted); margin-top: 24px;">
  Pas encore d'app native ? Tu peux continuer depuis ton navigateur ou télécharger Raw Adventure sur l'App Store ou Google Play une fois publiée.
</p>

</div>

<script>
  /*
   * Stratégie multi-contexte pour le bouton "Retourner dans l'app" :
   *
   *  - Native (iOS/Android app installée via TestFlight/store) : on tente
   *    le deep link rawadventure://subscription-success. iOS bloque les
   *    custom schemes via <a href> mais autorise via window.location si
   *    déclenché depuis un user gesture (le tap). Si l'OS reconnaît le
   *    scheme, l'app prend focus → visibilitychange detect → on annule
   *    le hint.
   *
   *  - PWA / desktop browser : pas d'app à intercepter. window.location
   *    sur custom scheme donne l'erreur "adresse invalide". On évite
   *    en détectant l'absence de support et en affichant directement
   *    le hint desktop ("reviens dans ton onglet, c'est déjà actif").
   *
   * Détection heuristique : User Agent contient "Mobile" + iOS/Android
   * → on tente le deep link. Sinon → message desktop direct.
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
        // Desktop browser / PWA Mac → pas de deep link possible.
        if (hintDesktop) hintDesktop.style.display = 'block';
        return;
      }

      // Mobile → tente deep link puis fallback hint après 1.5s.
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

---

### Reçu

Tu recevras un email de confirmation et un reçu Stripe à l'adresse fournie lors du paiement. Si tu ne le vois pas, vérifie tes spams ou contacte [support@rawadventure.world](mailto:support@rawadventure.world).

### Gérer ton abonnement

Depuis l'app : Profil → Mon abonnement → Stripe Customer Portal.

Tu peux à tout moment changer de plan, mettre à jour ton moyen de paiement, télécharger tes factures, ou annuler.
