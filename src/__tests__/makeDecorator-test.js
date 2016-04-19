import { expect } from 'chai';
import invariant from 'invariant';
import makeDecorator, {
  applyDecoratorToComponent,
  applyOptionsToDecorator,
} from '../makeDecorator';
import { spy } from 'sinon';

const mockOptions = {
  propName: 'test',
};

const mockValue = 'testing';

const mockDecorator = ({propName}) => (props) => {
  invariant(
    typeof propName === 'string',
    'expected `propName` to be a `%s`',
    propName
  );
  return {
    ...props,
    [propName]: mockValue,
  };
};

describe('makeDecorator', () => {
  it('throws for a nonfunction', () => {
    expect(() => makeDecorator()).to.throw();
    expect(() => makeDecorator({})).to.throw();
    expect(() => makeDecorator(mockDecorator)).not.to.throw();
  });

  it('returns a function', () => {
    expect(makeDecorator(mockDecorator)).to.be.a('function');
  });

  describe('applyOptionsToDecorator', () => {
    it('passes options to the decorator constructor', () => {
      const constructor = spy();
      applyOptionsToDecorator(constructor, mockOptions);
      expect(constructor.called).to.equal(true);
      expect(constructor.calledWith(mockOptions)).to.equal(true);
    });

    it('partials applyDecoratorToComponent', () => {
      const withOptions = applyOptionsToDecorator(() => {}, mockOptions);
      expect(
        withOptions.length
      ).to.equal(
        applyDecoratorToComponent.length - 1
      );
    });
  });
});
