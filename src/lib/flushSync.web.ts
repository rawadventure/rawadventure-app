/**
 * flushSync — version web : ré-export du flushSync de react-dom.
 *
 * Utilisé par VideoPreview pour monter l'élément <video> de façon synchrone
 * pendant le geste utilisateur (tap play) : iOS Safari n'autorise lecture et
 * plein écran que dans la pile d'appel d'un vrai geste, or un setState normal
 * ne commit qu'après le handler (batching React) — la ref vidéo serait encore
 * nulle au moment d'enchaîner fullscreen + lecture.
 *
 * Types : react-dom n'embarque pas ses propres types et @types/react-dom
 * n'est pas installé — déclaration ambiante minimale dans declarations.d.ts.
 */
export { flushSync } from 'react-dom';
