import makeDecorator from '../makeDecorator';
import { PropTypes } from 'react';

export const increment = ({transformProp, toProp}) => props => {
  return {
    ...props,
    [toProp]: props[transformProp] + 1
  };
};

increment.displayName = ({transformProp, toProp}) => {
  return `increment(${transformProp} as ${toProp})`;
};

increment.defaultProps = ({transformProp}) => defaults => {
  return {
    ...defaults,
    [transformProp]: 0,
  };
};

increment.propTypes = ({transformProp}) => propTypes => {
  return {
    ...propTypes,
    [transformProp]: PropTypes.number.isRequired,
  };
};

export default makeDecorator(increment);
