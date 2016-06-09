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

MockComponent.displayName = 'MockComponent';

const DecoratedComponent = composeDecorators(
  increment('count', 'countPlus'),
  increment('countPlus', 'countPlusPlus')
)(MockComponent);

describe('EXAMPLE: stateless "increment" decorator', () => {
  it('generates a proper displayName', () => {
    expect(
      DecoratedComponent.displayName
    ).to.equal(
      'Decorated(increment(count as countPlus) -> increment(countPlus as countPlusPlus))(MockComponent)'
    );
  });

  it('generates the propert defaults', () => {
    const {count, countPlus} = DecoratedComponent.defaultProps;
    expect(count).to.equal(0);
    expect(countPlus).to.equal(0);
  });

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
