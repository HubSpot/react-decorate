import { PropTypes } from 'react';
import { makeDecorator } from 'react-decorate';

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

export const counter = ({propName}) => (props, state, setState) => {
  return {
    ...props,
    [propName]: state,
    [`inc${capitalize(propName)}`]: () => setState(state + 1),
  };
};

counter.displayName = ({propName}) => {
  return `counter(${propName})`;
};

counter.defaultProps = ({propName}) => defaults => {
  return {
    ...defaults,
    [`default${capitalize(propName)}`]: 0,
  };
};

counter.propTypes = ({propName}) => (propTypes) => {
  return {
    ...propTypes,
    [`default${capitalize(propName)}`]: PropTypes.number.isRequired,
  };
};

export default makeDecorator(counter);
