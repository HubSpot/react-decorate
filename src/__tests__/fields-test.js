import { expect } from 'chai';
import {
  toContextTypes,
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

  describe('toDefaultProps', () => {
    it('retrieves static defaultProps', () => {
      const Base = {defaultProps: {one: 1}};
      const first = {defaultProps: stub().returnsArg(0)};
      const second = {defaultProps: types => ({...types, two: 2})};
      expect(toDefaultProps([first, second], Base)).to.deep.equal({one: 1, two: 2});
      expect(first.defaultProps.calledWith(Base.defaultProps)).to.equal(true);
    });

    it('retrieves createClass-style getDefaultProps', () => {
      const mockDefaults = {one: 1};
      const Base = {getDefaultProps: () => mockDefaults};
      const first = {defaultProps: stub().returnsArg(0)};
      const second = {defaultProps: types => ({...types, two: 2})};
      expect(toDefaultProps([first, second], Base)).to.deep.equal({one: 1, two: 2});
      expect(first.defaultProps.calledWith(mockDefaults)).to.equal(true);
    });
  });

  it('toContextTypes', () => {
    const huh = () => {};
    const what = () => {};
    const Base = {contextTypes: {what}};
    const first = {contextTypes: stub().returnsArg(0)};
    const second = {contextTypes: types => ({...types, huh})};
    expect(toContextTypes([first, second], Base)).to.deep.equal({huh, what});
    expect(first.contextTypes.calledWith(Base.contextTypes)).to.equal(true);
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
    const context = {testContext: 'testing'};
    const first = {initialState: stub().returns(1)};
    const second = {initialState: ({test}) => test};
    expect(toInitialState([first, second], props, setState, context)).to.deep.equal({
      0: 1,
      1: props.test,
    });
    expect(first.initialState.lastCall.args[0]).to.equal(props);
    expect(first.initialState.lastCall.args[1]).to.be.a('function');
    expect(first.initialState.lastCall.args[2]).to.equal(context);
  });

  it('toProps', () => {
    const props = {test: 'testing'};
    const state = {0: 1, 1: 2};
    const setState = stub();
    const context = {testContext: 'context'};
    const first = {nextProps: stub().callsArg(2).returnsArg(0)};
    const second = {nextProps: (prev) => ({...prev, omg: 'wow'})};
    expect(toProps([first, second], props, state, setState, context)).to.deep.equal({
      ...props,
      omg: 'wow',
    });
    expect(first.nextProps.calledWith(props, 1)).to.equal(true);
    expect(setState.calledWith(0)).to.equal(true);
    expect(first.nextProps.lastCall.args[2]).to.be.a('function');
    expect(first.nextProps.lastCall.args[3]).to.equal(context);
  });

  it('toUnmount', () => {
    const props = {};
    const state = {0: 1};
    const first = {unmount: spy()};
    const second = {unmount: spy()};
    const context = {testContext: 'testing'};
    toUnmount([first, second], props, state, context);
    expect(first.unmount.calledWith(props, 1, context)).to.equal(true);
    expect(second.unmount.calledWith(props, undefined, context)).to.equal(true);
  });
});
