import { expect } from 'chai';
import { shallow } from 'enzyme';
import persistentUniqueId from '../persistentUniqueId';
import React, { PropTypes } from 'react';

function MockComponent() {
  return <div />;
}

MockComponent.displayName = 'MockComponent';

MockComponent.propTypes = {
  uniq: PropTypes.func.isRequired,
};

const DecoratedComponent = persistentUniqueId({
  propName: 'uniq',
})(MockComponent);

describe('EXAMPLE: "persistentUniqueId" decorator', () => {
  it('generates a proper displayName', () => {
    expect(
      DecoratedComponent.displayName
    ).to.equal(
      'Decorated(uniqueId(uniq))(MockComponent)'
    );
  });

  it('filters out the propTypes it defines', () => {
    expect(DecoratedComponent.propTypes.uniq).to.equal(undefined);
  });

  it('passes down a uniqueId function', () => {
    const root = shallow(<DecoratedComponent />);
    expect(root.prop('uniq')).to.be.a('function');
  });

  it('generates persistent unique ids', () => {
    const root = shallow(<DecoratedComponent />);
    const uniqueId = root.prop('uniq');
    const first = uniqueId('testing');
    const second = uniqueId('testing');
    expect(first).to.be.a('string');
    expect(second).to.be.a('string');
    expect(first).to.equal(second);
  });

  it('generates different ids for different instances', () => {
    const first = shallow(<DecoratedComponent />);
    const second = shallow(<DecoratedComponent />);
    expect(
      first.prop('uniq')('testing')
    ).to.not.equal(
      second.prop('uniq')('testing')
    );
  });
});
