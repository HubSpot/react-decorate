import makeDecorator from '../makeDecorator';
import { PropTypes } from 'react';

export const exposeContext = (contextField) => {
  return {
    displayName() {
      return `exposeContext(${contextField})`;
    },

    contextTypes(types) {
      return {
        ...types,
        [contextField]: PropTypes.any,
      };
    },

    nextProps(props, state, setState, context) {
      return {
        ...props,
        [contextField]: context[contextField],
      };
    },
  };
};

export default makeDecorator(exposeContext);
