import { expect } from 'chai'
import { shallow } from 'enzyme'
import makeDecorator from '../makeDecorator'
import React from 'react'

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
    const {count, incCount} = shallow(<ClickCounter />).props()
    expect(count).to.equal(0)
    expect(incCount).to.be.a('function')
  })

  it('increments the count', () => {
    const root = shallow(<ClickCounter />)
    expect(root.prop('count')).to.equal(0)
    root.prop('incCount')()
    root.prop('incCount')()
    root.prop('incCount')()
    root.update()
    expect(root.prop('count')).to.equal(3)
  })
})
