// babel.config.js — config Babel pour Expo + Reanimated 4.
//
// Le plugin `react-native-worklets/plugin` (Reanimated 4) DOIT être listé en
// dernier dans `plugins`. Il transforme les fonctions marquées 'worklet' pour
// qu'elles puissent s'exécuter sur le UI thread (animations 60fps).
//
// Sans ce plugin : runtime error "Reanimated runtime not ready" au boot dès
// qu'un useSharedValue / useAnimatedStyle est appelé.
//
// Réf : https://docs.swmansion.com/react-native-reanimated/docs/4.x/guides/setup/

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-worklets/plugin'],
  };
};
