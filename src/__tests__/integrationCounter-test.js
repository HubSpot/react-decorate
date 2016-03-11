import { expect } from 'chai'
import makeDecorator from '../makeDecorator'
import React from 'react'
import { createRenderer } from 'react-addons-test-utils'

function render(element) {
  const renderer = createRenderer()
  renderer.render(element)
  return renderer.getRenderOutput()
}

describe('example: Counter', () => {
  const counter = makeDecorator((
    valueName = 'count',
    incName = 'incCount'
  ) => {
    let count = 0
    return {
      displayName: () => `counter(${valueName},${incName})`,
      nextProps: (props, onNext) => ({
        ...props,
        [valueName]: count,
        [incName]: () => {
          count += 1
          onNext()
        },
      }),
    }
  })

  const ClickCounter = counter(
    'count',
    'incCount'
  )(({count, incCount}) => (
    <button onClick={incCount}>
      {count} clicks
    </button>
  ))

  it('passes count and incCount', () => {
    const {props: {count, incCount}} = render(<ClickCounter />)
    expect(count).to.equal(0)
    expect(incCount).to.be.a('function')
  })

  it('increments the count', () => {
    const renderer = createRenderer()
    renderer.render(<ClickCounter />)
    const firstOutput = renderer.getRenderOutput()
    expect(firstOutput.props.count).to.equal(0)
    firstOutput.props.incCount()
    firstOutput.props.incCount()
    firstOutput.props.incCount()
    const nextOutput = renderer.getRenderOutput()
    expect(nextOutput.props.count).to.equal(3)
  })
})
