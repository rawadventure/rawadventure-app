/**
 * svgMock.js — stub Jest pour les imports .svg (react-native-svg-transformer
 * côté Metro les transforme en composants React ; sous Jest on rend un View
 * vide portant le testID 'svg-mock').
 */
const React = require('react');
const { View } = require('react-native');

module.exports = function SvgMock(props) {
  return React.createElement(View, { ...props, testID: props.testID ?? 'svg-mock' });
};
module.exports.default = module.exports;
