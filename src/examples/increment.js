import makeDecorator from '../makeDecorator';
import { PropTypes } from 'react';

export const increment = (transformProp, toProp) => {
  return {
    displayName() {
      return `increment(${transformProp} as ${toProp})`;
    },

    defaultProps(defaults) {
      return {
        ...defaults,
        [transformProp]: 0,
      };
    },

    propTypes(propTypes) {
      return {
        ...propTypes,
        [transformProp]: PropTypes.number.isRequired,
      };
    },

    nextProps(props) {
      return {
        ...props,
        [toProp]: props[transformProp] + 1
      };
    },
  };
};

export default makeDecorator(increment);
