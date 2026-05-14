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
