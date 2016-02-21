import { applyConfigs } from '../apply'
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

describe('applyConfigs', () => {
  it('returns an object', () => {
    expect(applyConfigs([], MockComponent)).to.be.a('function')
  })

  it('renders the base component', () => {
    const DecoratedComponent = applyConfigs([], MockComponent)
    const renderer = createRenderer()
    renderer.render(<DecoratedComponent />)
    const output = renderer.getRenderOutput()
    expect(isElementOfType(output, MockComponent)).to.equal(true)
  })
})
