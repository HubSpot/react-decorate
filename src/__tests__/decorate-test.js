import { decorateWithConfigs } from '../decorate'
import { expect } from 'chai'
import React from 'react'
import {
  createRenderer,
  isElementOfType,
} from 'react-addons-test-utils'

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
    const mockFieldName = 'testing'
    const DecoratedComponent = decorateWithConfigs([{
      getDisplayName() {
        return mockFieldName
      },
      getValues() {},
    }], MockComponent)
    expect(DecoratedComponent.displayName).to.equal('MockComponent<testing>')
  })

  it('renders the base component', () => {
    const DecoratedComponent = decorateWithConfigs([], MockComponent)
    const renderer = createRenderer()
    renderer.render(<DecoratedComponent />)
    const output = renderer.getRenderOutput()
    expect(isElementOfType(output, MockComponent)).to.equal(true)
  })
})
