import { PropTypes } from 'react';
import makeDecorator from '../makeDecorator';

const increment = ({transformProp, toProp}) => props => {
  return {
    ...props,
    [toProp]: props[transformProp] + 1
  };
};

increment.displayName = ({transformProp, toProp}) => {
  return `increment(${transformProp}->${toProp})`;
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

const incrementDecorator = makeDecorator(increment);

describe('stateless decorator', () => {
  console.log(incrementDecorator);
});
