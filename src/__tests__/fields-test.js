import { expect } from 'chai';
import {
  toDisplayName,
  toDefaultProps,
  toInitialState,
  toProps,
  toPropTypes,
  toUnmount,
} from '../fields';
import { spy, stub } from 'sinon';

describe('fields', () => {
  it('toDisplayName', () => {
    const first = {displayName: () => 'one'};
    const second = {displayName: () => 'two'};
    const Base = {displayName: 'Base'};
    expect(
      toDisplayName([first, second], Base)
    ).to.equal(
      'Decorated(one -> two)(Base)'
    );
  });

  it('toDefaultProps', () => {
    const Base = {defaultProps: {one: 1}};
    const first = {defaultProps: stub().returnsArg(0)};
    const second = {defaultProps: types => ({...types, two: 2})};
    expect(toDefaultProps([first, second], Base)).to.deep.equal({one: 1, two: 2});
    expect(first.defaultProps.calledWith(Base.defaultProps)).to.equal(true);
  });

  it('toPropTypes', () => {
    const huh = () => {};
    const what = () => {};
    const Base = {propTypes: {what}};
    const first = {propTypes: stub().returnsArg(0)};
    const second = {propTypes: types => ({...types, huh})};
    expect(toPropTypes([first, second], Base)).to.deep.equal({huh, what});
    expect(first.propTypes.calledWith(Base.propTypes)).to.equal(true);
  });

  it('toInitialState', () => {
    const props = {test: 2};
    const setState = () => {};
    const first = {initialState: stub().returns(1)};
    const second = {initialState: ({test}) => test};
    expect(toInitialState([first, second], props, setState)).to.deep.equal({
      0: 1,
      1: props.test,
    });
    expect(first.initialState.calledWith(props, setState)).to.equal(true);
  });

  it('toProps', () => {
    const props = {test: 'testing'};
    const state = {0: 1, 1: 2};
    const setState = stub();
    const first = {nextProps: stub().callsArg(2).returnsArg(0)};
    const second = {nextProps: (prev) => ({...prev, omg: 'wow'})};
    expect(toProps([first, second], props, state, setState)).to.deep.equal({
      ...props,
      omg: 'wow',
    });
    expect(first.nextProps.calledWith(props, 1)).to.equal(true);
    expect(setState.calledWith(0)).to.equal(true);
  });

  it('toUnmount', () => {
    const props = {};
    const state = {0: 1};
    const first = {unmount: spy()};
    const second = {unmount: spy()};
    toUnmount([first, second], props, state);
    expect(first.unmount.calledWith(props, 1)).to.equal(true);
    expect(second.unmount.calledWith(props, undefined)).to.equal(true);
  });
});
