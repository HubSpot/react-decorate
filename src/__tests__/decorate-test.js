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
  getHandlerName: () => 'setOne',
  getDefaultProps: () => ({type: 'test'}),
  getPropName: () => 'one',
  getPropTypes: () => ({type: function() {}}),
  handleChange: (value) => value,
  componentWillMount: () => 1,
  componentWillReceiveProps: () => 2,
}

const OtherDecorator = {
  getPropName: () => 'two',
  getInitialState: () => 2,
  componentWillReceiveProps: () => 3,
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

  it('generates a proper propName', () => {
    const DecoratedComponent = decorateWithConfigs([
      MockDecorator,
      OtherDecorator,
    ], MockComponent)
    expect(
      DecoratedComponent.displayName
    ).to.equal(
      'MockComponent+[one,two]'
    )
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

  it('generates change handlers', () => {
    let lastChange
    const DecoratedComponent = decorateWithConfigs([{
      ...MockDecorator,
      handleChange(props, value) {
        lastChange = value
        return value
      },
    }], MockComponent)
    const output = render(<DecoratedComponent />)
    expect(output.props.setOne).to.be.a('function')
    expect(output.props.one).to.equal(1)
    output.props.setOne(2)
    expect(lastChange).to.equal(2)
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

  it('runs the componentWillMount cycle', () => {
    const DecoratedComponent = decorateWithConfigs(
      [MockDecorator],
      MockComponent,
    )
    const output = render(<DecoratedComponent />)
    expect(output.props.one).to.deep.equal(1)
  })

  it('runs the componentWillReceiveProps cycle', () => {
    const DecoratedComponent = decorateWithConfigs(
      [MockDecorator, OtherDecorator],
      MockComponent
    )
    const renderer = createRenderer()
    renderer.render(<DecoratedComponent />)
    renderer.render(<DecoratedComponent />)
    const output = renderer.getRenderOutput()
    expect(output.props.one).to.deep.equal(2)
    expect(output.props.two).to.deep.equal(3)
  })

  it('runs the componentWillUnmount cycle', () => {
    let unmounted = false
    const DecoratedComponent = decorateWithConfigs([{
      ...MockDecorator,
      componentWillUnmount: () => unmounted = true,
    }], MockComponent)
    const renderer = createRenderer()
    renderer.render(<DecoratedComponent />)
    renderer.unmount()
    expect(unmounted).to.equal(true)
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
