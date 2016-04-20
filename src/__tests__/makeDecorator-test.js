import { expect } from 'chai';
import invariant from 'invariant';
import makeDecorator, {
  applyDecoratorToComponent,
  applyOptionsToDecorator,
} from '../makeDecorator';
import { stub } from 'sinon';

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
  invariant(
    typeof propName === 'string',
    'expected `propName` to be a `%s`',
    propName
  );
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

  describe('applyOptionsToDecorator', () => {
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
