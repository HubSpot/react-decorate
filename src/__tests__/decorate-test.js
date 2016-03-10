import { decorateWithConfigs } from '../decorate'
import { expect } from 'chai'
import React from 'react'
import {
  createRenderer,
  isElementOfType,
} from 'react-addons-test-utils'

function render(element) {
  const renderer = createRenderer()
  renderer.render(element)
  return renderer.getRenderOutput()
}

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
  step: (props, onNext) => ({
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
  step: () => ({
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
    const output = render(<DecoratedComponent />)
    expect(output.props.type).to.equal('test')
    expect(output.props.unrelated).to.equal('unrelated')
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
    const output = render(<DecoratedComponent />)
    expect(output.props.two).to.deep.equal(2)
  })

  it('passes props', () => {
    const DecoratedComponent = decorateWithConfigs(
      [MockDecorator],
      MockComponent
    )
    const output = render(
      <DecoratedComponent
        one={1}
        two={2}
      />
    )
    expect(output.props.one).to.deep.equal(1)
    expect(output.props.setOne).to.be.a('function')
    expect(output.props.two).to.deep.equal(2)
  })

  it('obeys onNext', () => {
    const DecoratedComponent = decorateWithConfigs(
      [MockDecorator],
      MockComponent
    )
    const renderer = createRenderer()
    renderer.render(
      <DecoratedComponent
        one={1}
        two={2}
      />
    )
    const firstOutput = renderer.getRenderOutput()
    expect(firstOutput.props.one).to.deep.equal(1)
    firstOutput.props.setOne(2)
    expect(renderer.getRenderOutput().props.one).to.deep.equal(2)
  })

  it('calls unmount', () => {
    let unmounted = false
    const DecoratedComponent = decorateWithConfigs([{
      displayName: () => 'mock',
      step: (props) => props,
      unmount: () => unmounted = true,
    }], MockComponent)
    const renderer = createRenderer()
    renderer.render(
      <DecoratedComponent
        one={1}
        two={2}
      />
    )
    expect(unmounted).to.equal(false)
    renderer.unmount()
    expect(unmounted).to.equal(true)
  })

  it('renders the base component', () => {
    const DecoratedComponent = decorateWithConfigs([], MockComponent)
    const output = render(<DecoratedComponent />)
    expect(isElementOfType(output, MockComponent)).to.equal(true)
  })
})
