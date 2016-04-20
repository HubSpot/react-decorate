import { expect } from 'chai';
import { COMPOSING } from '../constants';
import { shallow } from 'enzyme';
import makeDecorator, {
  applyDecoratorToComponent,
  applyOptionsToDecorator,
} from '../makeDecorator';
import React from 'react';
import { stub } from 'sinon';

const MockComponent = () => <div />;
MockComponent.displayName = 'MockComponent';

const mockValue = 'testing';
const mockDecorator = {
  displayName() {
    return 'mockDecorator';
  },

  nextProps(props) {
    return {
      ...props,
      testing: mockValue,
    };
  },
};

const mockConstructor = () => {
  return mockDecorator;
};

describe('makeDecorator', () => {
  it('throws for a nonfunction', () => {
    expect(() => makeDecorator()).to.throw();
    expect(() => makeDecorator({})).to.throw();
    expect(() => makeDecorator(mockConstructor)).not.to.throw();
  });

  it('returns a function', () => {
    expect(makeDecorator(mockConstructor)).to.be.a('function');
  });

  describe('applyDecoratorToComponent', () => {
    it('returns a component that renders the wrapped component', () => {
      const Wrapped = applyDecoratorToComponent(mockDecorator, MockComponent);
      const root = shallow(<Wrapped />);
      expect(root.is(MockComponent)).to.equal(true);
      expect(root.prop('testing')).to.equal(mockValue);
    });

    it('returns the decorator when composing', () => {
      expect(
        applyDecoratorToComponent(mockDecorator, COMPOSING)
      ).to.equal(mockDecorator);
    });
  });

  describe('applyOptionsToDecorator', () => {
    it('validates the decorator', () => {
      expect(() => applyOptionsToDecorator(() => {})).to.throw();
      expect(() => applyOptionsToDecorator(() => mockDecorator)).not.to.throw();
    });

    it('passes options to the decorator constructor', () => {
      const constructor = stub().returns(mockDecorator);
      const mockOptions = {};
      const otherMockOptions = 6;
      applyOptionsToDecorator(constructor, mockOptions, otherMockOptions);
      expect(constructor.called).to.equal(true);
      expect(constructor.calledWith(mockOptions, otherMockOptions)).to.equal(true);
    });
  });
});
