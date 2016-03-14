import { decorateWithConfigs } from '../decorate'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import React from 'react'

const MockComponent = React.createClass({
  propTypes: {
    one: function() {},
    unrelated: function() {},
  },

  getDefaultProps() {
    return {
      unrelated: 'unrelated',
    }
  },

  render() {
    return <div />
  },
})

let mockState = 1
const MockDecorator = {
  displayName: () => 'mock',
  propTypes: ({one, ...others}) => ({
    ...others,
    type: function() {},
  }),
  defaultProps: (defaults) => {
    return {
      ...defaults,
      type: 'test',
    }
  },
  nextProps: (props, onNext) => ({
    ...props,
    one: mockState,
    setOne: (next) => {
      mockState = next
      onNext()
    },
  }),
}

const OtherDecorator = {
  displayName: () => 'other',
  nextProps: () => ({
    two: 2,
  }),
}

describe('decorateWithConfigs', () => {
  it('returns an object', () => {
    expect(decorateWithConfigs([], MockComponent)).to.be.a('function')
  })

  it('filters decorator propTypes', () => {
    const DecoratedComponent = decorateWithConfigs(
      [MockDecorator],
      MockComponent
    )
    expect(DecoratedComponent.propTypes.one).to.equal(undefined)
  })

  it('generates default props', () => {
    const DecoratedComponent = decorateWithConfigs(
      [MockDecorator],
      MockComponent
    )
    const root = shallow(<DecoratedComponent />)
    expect(root.prop('type')).to.equal('test')
    expect(root.prop('unrelated')).to.equal('unrelated')
  })

  it('generates propTypes', () => {
    const DecoratedComponent = decorateWithConfigs(
      [MockDecorator],
      MockComponent
    )
    expect(DecoratedComponent.propTypes.type).to.be.a('function')
    expect(DecoratedComponent.propTypes.unrelated).to.be.a('function')
  })

  it('runs the getInitialState cycle', () => {
    const DecoratedComponent = decorateWithConfigs(
      [OtherDecorator],
      MockComponent
    )
    const root = shallow(<DecoratedComponent />)
    expect(root.prop('two')).to.deep.equal(2)
  })

  it('passes props', () => {
    const DecoratedComponent = decorateWithConfigs(
      [MockDecorator],
      MockComponent
    )
    const root = shallow(
      <DecoratedComponent
        one={1}
        two={2}
      />
    )
    expect(root.prop('one')).to.deep.equal(1)
    expect(root.prop('setOne')).to.be.a('function')
    expect(root.prop('two')).to.deep.equal(2)
  })

  it('obeys onNext', () => {
    const DecoratedComponent = decorateWithConfigs(
      [MockDecorator],
      MockComponent
    )
    const root = shallow(
      <DecoratedComponent
        one={1}
        two={2}
      />
    )
    expect(root.prop('one')).to.equal(1)
    root.prop('setOne')(2)
    root.update()
    expect(root.prop('one')).to.equal(2)
  })

  it('calls unmount', () => {
    let unmounted = false
    const DecoratedComponent = decorateWithConfigs([{
      displayName: () => 'mock',
      nextProps: (props) => props,
      unmount: () => unmounted = true,
    }], MockComponent)
    const root = shallow(
      <DecoratedComponent
        one={1}
        two={2}
      />
    )
    expect(unmounted).to.equal(false)
    root.unmount()
    expect(unmounted).to.equal(true)
  })

  it('renders the base component', () => {
    const DecoratedComponent = decorateWithConfigs([], MockComponent)
    const root = shallow(<DecoratedComponent />)
    expect(root.is(MockComponent)).to.equal(true)
  })
})
