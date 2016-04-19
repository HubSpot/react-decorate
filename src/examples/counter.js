import makeDecorator from '../makeDecorator';
import { PropTypes } from 'react';

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

export const counter = ({propName}) => (props, state, setState) => {
  const defaultName = `default${capitalize(propName)}`;
  const count = state || props[defaultName];
  const nextProps = {
    ...props,
    [propName]: count,
    [`inc${capitalize(propName)}`]: () => setState(count + 1),
  };
  delete nextProps[defaultName];
  return nextProps;
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
