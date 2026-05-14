// metro.config.js — config Metro bundler.
//
// Ajoute le support des fichiers .svg via `react-native-svg-transformer`,
// qui les transforme en composants React utilisables comme :
//   import Logo from './assets/images/logo-raw-adventure-white.svg';
//   <Logo width={120} height={120} color="#FFFFFF" />
//
// Référence : https://github.com/kristerkari/react-native-svg-transformer

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
};

module.exports = config;
