import { expect } from 'chai';
import composeDecorators from '../../composeDecorators';
import { shallow } from 'enzyme';
import increment from '../increment';
import React, { PropTypes } from 'react';

function MockComponent() {
  return <div />;
}

MockComponent.propTypes = {
  count: PropTypes.number.isRequired,
};

const DecoratedComponent = composeDecorators(
  increment({
    transformProp: 'count',
    toProp: 'countPlus',
  }),
  increment({
    transformProp: 'countPlus',
    toProp: 'countPlusPlus',
  })
)(MockComponent);

describe('EXAMPLE: stateless "increment" decorator', () => {
  it('passes existing propTypes', () => {
    expect(
      DecoratedComponent.propTypes.count
    ).to.equal(
      MockComponent.propTypes.count
    );
  });

  it('adds countPlus propType', () => {
    expect(
      DecoratedComponent.propTypes.countPlus
    ).to.equal(
      PropTypes.number.isRequired
    );
  });

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
