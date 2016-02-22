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
  render() {
    return <div />
  },
})

describe('decorateWithConfigs', () => {
  it('returns an object', () => {
    expect(decorateWithConfigs([], MockComponent)).to.be.a('function')
  })

  it('generates a proper displayName', () => {
    const DecoratedComponent = decorateWithConfigs([{
      getDisplayName: () => 'testing',
    }, {
      getDisplayName: () => 'other',
    }], MockComponent)
    expect(
      DecoratedComponent.displayName
    ).to.equal(
      'MockComponent<testing, other>'
    )
  })

  it('runs the getInitialState cycle', () => {
    const state = {one: 1, two: 2}
    const DecoratedComponent = decorateWithConfigs(
      [{getInitialState: () => state}],
      MockComponent
    )
    const output = render(<DecoratedComponent />)
    expect(output.props).to.deep.equal(state)
  })

  it('runs the componentWillMount cycle', () => {
    const state = {one: 1, two: 2}
    const DecoratedComponent = decorateWithConfigs(
      [{componentWillMount: () => state}],
      MockComponent
    )
    const output = render(<DecoratedComponent />)
    expect(output.props).to.deep.equal(state)
  })

  it('runs the componentWillReceiveProps cycle', () => {
    const state = {one: 1, two: 2}
    const DecoratedComponent = decorateWithConfigs(
      [{componentWillReceiveProps: () => state}],
      MockComponent
    )
    const renderer = createRenderer()
    renderer.render(<DecoratedComponent />)
    renderer.render(<DecoratedComponent />)
    const output = renderer.getRenderOutput()
    expect(output.props).to.deep.equal(state)
  })

  it('runs the componentWillUnmount cycle', () => {
    let unmounted = false
    const DecoratedComponent = decorateWithConfigs(
      [{componentWillUnmount: () => unmounted = true}],
      MockComponent
    )
    const renderer = createRenderer()
    renderer.render(<DecoratedComponent />)
    renderer.unmount()
    expect(unmounted).to.equal(true)
  })

  it('passes props', () => {
    const DecoratedComponent = decorateWithConfigs([], MockComponent)
    const testProps = {one: 1, two: 2}
    const output = render(<DecoratedComponent {...testProps} />)
    expect(output.props).to.deep.equal(testProps)
  })

  it('renders the base component', () => {
    const DecoratedComponent = decorateWithConfigs([], MockComponent)
    const output = render(<DecoratedComponent />)
    expect(isElementOfType(output, MockComponent)).to.equal(true)
  })
})
