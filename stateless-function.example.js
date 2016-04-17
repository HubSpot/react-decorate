import { PropTypes } from 'react';
import { makeDecorator } from 'react-decorate';

function splat(original, additions) {
  return Object.assign({}, original, additions);
}

export const increment = ({transformProp, toProp}) => props => {
  return splat(props, {
    [toProp]: props[transformProp] + 1
  });
};

increment.displayName = ({transformProp, toProp}) => {
  return `increment(${transformProp}->${toProp})`;
};

increment.defaultProps = ({transformProp}) => defaults => {
  return splat(defaults, {
    [transformProp]: 0,
  });
};

increment.propTypes = ({transformProp}) => propTypes => {
  return splat(propTypes, {
    [transformProp]: PropTypes.number.isRequired,
  });
};

export default makeDecorator(increment);
