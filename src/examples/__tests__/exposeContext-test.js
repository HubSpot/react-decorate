import { expect } from 'chai';
import { shallow } from 'enzyme';
import exposeContext from '../exposeContext';
import React, { PropTypes } from 'react';

const MOCK_CONTEXT_FIELD = 'testing';
const MOCK_CONTEXT_VALUE = 'value';

function MockComponent() {
  return <div />;
}

MockComponent.displayName = 'MockComponent';

const DecoratedComponent = exposeContext(
  MOCK_CONTEXT_FIELD
)(
  MockComponent
);

describe('EXAMPLE: exposeContext', () => {
  it('generates a proper displayName', () => {
    expect(
      DecoratedComponent.displayName
    ).to.equal(
      'Decorated(exposeContext(testing))(MockComponent)'
    );
  });

  it('generates the correct context types', () => {
    expect(
      DecoratedComponent.contextTypes
    ).to.deep.equal({
      [MOCK_CONTEXT_FIELD]: PropTypes.any,
    });
  });

  it('passes the context field as a prop', () => {
    const root = shallow(<DecoratedComponent />, {
      context: {
        [MOCK_CONTEXT_FIELD]: MOCK_CONTEXT_VALUE,
      },
    });
    expect(
      root.prop(MOCK_CONTEXT_FIELD)
    ).to.equal(
      MOCK_CONTEXT_VALUE
    );
  });
});
