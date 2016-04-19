import { expect } from 'chai';
import composeDecorators from '../composeDecorators';
import { shallow } from 'enzyme';
import makeDecorator from '../makeDecorator';
import React, { PropTypes } from 'react';

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

function MockComponent() {
  return <div />;
}

const DecoratedComponent = composeDecorators(
  incrementDecorator({
    transformProp: 'count',
    toProp: 'countPlus',
  }),
  incrementDecorator({
    transformProp: 'countPlus',
    toProp: 'countPlusPlus',
  })
)(MockComponent);

describe('stateless decorator', () => {
  it('adds a new `countPlus` prop', () => {
    const root = shallow(<DecoratedComponent count={1} />);
    const {count, countPlus} = root.find(MockComponent).props();
    expect(count).to.equal(1);
    expect(countPlus).to.equal(2);
  });

  it('transforms countPlus to countPlusPlus', () => {
    const root = shallow(<DecoratedComponent count={4} />);
    const {countPlus, countPlusPlus} = root.find(MockComponent).props();
    expect(countPlus).to.equal(5);
    expect(countPlusPlus).to.equal(6);
  });
});
