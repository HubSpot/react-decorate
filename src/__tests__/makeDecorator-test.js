import { expect } from 'chai';
import makeDecorator from '../makeDecorator';

function mockDecorator() {
}

describe('makeDecorator', () => {
  it('throws for a nonfunction', () => {
    expect(() => makeDecorator({})).to.throw();
    expect(() => makeDecorator(mockDecorator)).not.to.throw();
  });
});
