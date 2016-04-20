import { expect } from 'chai';
import { shallow } from 'enzyme';
import makeDecoratedComponent from '../makeDecoratedComponent';
import React, { PropTypes } from 'react';

const mockOne = {
  displayName() {
    return 'one';
  },

  defaultProps(defaults) {
    return {
      ...defaults,
      defaultOne: 1,
    };
  },

  propTypes(types) {
    return {
      ...types,
      defaultOne: PropTypes.number,
    };
  },

  initialState({defaultOne}) {
    return defaultOne || 1;
  },

  nextProps({defaultOne, ...props}, state) {
    return {
      ...props,
      one: state || defaultOne,
    };
  },
};

function MockComponent() {
  return <div />;
}

MockComponent.displayName = 'MockComponent';

describe('makeDecoratedComponent', () => {
  let DecoratedComponent;
  beforeEach(() => {
    DecoratedComponent = makeDecoratedComponent([mockOne], MockComponent);
  });

  it('applies displayName', () => {
    expect(DecoratedComponent.displayName).to.deep.equal('Decorated(one)(MockComponent)');
  });

  it('applies defaultProps', () => {
    expect(DecoratedComponent.defaultProps).to.deep.equal({
      defaultOne: 1,
    });
  });

  it('applies propTypes', () => {
    expect(DecoratedComponent.propTypes).to.deep.equal({
      defaultOne: PropTypes.number,
    });
  });

  it('applies initialState', () => {
    const rootWithoutDefault = shallow(<DecoratedComponent />);
    expect(rootWithoutDefault.state(0)).to.equal(1);
    const rootWithDefault = shallow(<DecoratedComponent defaultOne={2} />);
    expect(rootWithDefault.state(0)).to.equal(2);
  });

  it('applies nextProps', () => {
    const rootWithoutDefault = shallow(<DecoratedComponent />);
    expect(rootWithoutDefault.prop('one')).to.equal(1);
    const rootWithDefault = shallow(<DecoratedComponent defaultOne={2} />);
    expect(rootWithDefault.prop('one')).to.equal(2);
  });
});
