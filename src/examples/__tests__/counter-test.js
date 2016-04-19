import { expect } from 'chai';
import composeDecorators from '../../composeDecorators';
import counter from '../counter';
import { shallow } from 'enzyme';
import React, { PropTypes } from 'react';

function MockComponent() {
  return <div />;
}

MockComponent.displayName = 'MockComponent';

const DecoratedComponent = composeDecorators(
  counter({propName: 'clicks'}),
  counter({propName: 'hovers'})
)(MockComponent);

describe('EXAMPLE: stateful "counter" decorator', () => {
  it('generates a proper displayName', () => {
    expect(
      DecoratedComponent.displayName
    ).to.equal(
      'Decorated(counter(clicks) -> counter(hovers))(MockComponent)'
    );
  });

  it('generates the proper defaults', () => {
    const {defaultClicks, defaultHovers} = DecoratedComponent.defaultProps;
    expect(defaultClicks).to.equal(0);
    expect(defaultHovers).to.equal(0);
  });

  it('generates the proper propTypes', () => {
    const {defaultClicks, defaultHovers} = DecoratedComponent.propTypes;
    expect(defaultClicks).to.equal(PropTypes.number.isRequired);
    expect(defaultHovers).to.equal(PropTypes.number.isRequired);
  });

  it('props for "clicks" are applied', () => {
    const root = shallow(<DecoratedComponent />);
    const {clicks, incClicks} = root.props();
    expect(clicks).to.equal(0);
    expect(incClicks).to.be.a('function');
  });

  it('props for "hovers" are applied', () => {
    const root = shallow(<DecoratedComponent />);
    const {hovers, incHovers} = root.props();
    expect(hovers).to.equal(0);
    expect(incHovers).to.be.a('function');
  });

  it('increments clicks when incClicks is called', () => {
    const root = shallow(<DecoratedComponent />);
    root.prop('incClicks')();
    root.update();
    expect(root.prop('clicks')).to.equal(1);
    root.prop('incClicks')();
    root.update();
    expect(root.prop('clicks')).to.equal(2);
    root.prop('incClicks')();
    root.update();
    expect(root.prop('clicks')).to.equal(3);
  });
});
