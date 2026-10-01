/**
 * Titre de page web (PWA) — fixe sur tous les écrans.
 *
 * Par défaut React Navigation écrit `options.title ?? route.name` dans
 * document.title ; nos écrans n'ont pas de `title` et le titre devenait
 * « undefined ». iOS propose ce titre comme nom de l'app à l'installation
 * (« Ajouter à l'écran d'accueil ») — il doit rester le nom de la marque.
 */

export const APP_NAME = 'Raw Adventure';

export const APP_DOCUMENT_TITLE = {
  formatter: (_options?: Record<string, unknown>, _route?: { name: string }) => APP_NAME,
};
