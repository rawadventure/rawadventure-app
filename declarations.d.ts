// declarations.d.ts — types globaux additionnels.
//
// Permet l'import des SVG transformés par `react-native-svg-transformer`
// comme composants React Native :
//   import Logo from './assets/images/logo-raw-adventure-white.svg';
//   <Logo width={120} height={120} />

declare module '*.svg' {
  import type React from 'react';
  import type { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

// react-dom (19.1.0, dépendance web d'Expo) n'embarque pas ses propres types
// et @types/react-dom n'est pas installé. On ne consomme que flushSync
// (src/lib/flushSync.web.ts) — déclaré ici a minima.
declare module 'react-dom' {
  export function flushSync<R>(fn: () => R): R;
}
