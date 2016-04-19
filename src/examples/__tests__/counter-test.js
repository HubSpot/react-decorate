import { expect } from 'chai';
import composeDecorators from '../../composeDecorators';
import counter from '../counter';
import { shallow } from 'enzyme';
import React from 'react';

function MockComponent() {
  return <div />;
}

const DecoratedComponent = composeDecorators(
  counter({propName: 'clicks'}),
  counter({propName: 'hovers'})
)(MockComponent);

describe('EXAMPLE: stateful "counter" decorator', () => {
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
