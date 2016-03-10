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
  step: (props) => ({
    ...props,
    one: 1,
    setOne: (val) => val,
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
    const DecoratedComponent = decorateWithConfigs([], MockComponent)
    const output = render(
      <DecoratedComponent
        one={1}
        two={2}
      />
    )
    expect(output.props.one).to.deep.equal(1)
    expect(output.props.two).to.deep.equal(2)
  })

  it('renders the base component', () => {
    const DecoratedComponent = decorateWithConfigs([], MockComponent)
    const output = render(<DecoratedComponent />)
    expect(isElementOfType(output, MockComponent)).to.equal(true)
  })
})
