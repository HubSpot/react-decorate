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

  it('resolves the initial state', () => {
    const initialState = {one: 1, two: 2}
    const DecoratedComponent = decorateWithConfigs([{
      getInitialState() {
        return initialState
      },
    }], MockComponent)
    const output = render(<DecoratedComponent />)
    expect(output.props).to.deep.equal(initialState)
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
