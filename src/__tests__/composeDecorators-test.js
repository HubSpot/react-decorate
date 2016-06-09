import { expect } from 'chai';
import composeDecorators from '../composeDecorators';
import { COMPOSING } from '../constants';
import { spy } from 'sinon';

describe('composeDecorators', () => {
  it('applies COMPOSING to all decorators', () => {
    const first = spy();
    const second = spy();
    const third = spy();
    expect(composeDecorators(first, second, third)).to.be.a('function');
    expect(first.calledWith(COMPOSING));
    expect(second.calledWith(COMPOSING));
    expect(third.calledWith(COMPOSING));
  });
});
