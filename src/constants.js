export const COMPOSING = typeof Symbol === 'function' ?
  Symbol('composing') :
  '@@react-decorate/composing';

export const META_FIELDS = [
  'defaultProps',
  'displayName',
  'propTypes',
];
