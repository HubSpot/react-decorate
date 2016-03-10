import { expect } from 'chai'
import makeDecorator from '../makeDecorator'
import React from 'react'
import { createRenderer } from 'react-addons-test-utils'

function once(fn) {
  let happend = false
  let result
  return (...args) => {
    if (!happend) {
      result = fn(...args)
      happend = true
    }
    return result
  }
}

describe('example: UniqueIds', () => {
  let nextId = 1
  const makeUniqueIder = () => {
    let cache = {}
    return (key) => {
      if (!cache.hasOwnProperty(key)) {
        cache[key] = `${key}-${nextId++}`
      }
      return cache[key]
    }
  }

  const uniqueId = makeDecorator(({prop}) => ({
    displayName: () => 'uniqueId',
    step: once(() => ({
      [prop || 'uniqueId']: makeUniqueIder(),
    })),
  }))

  const UIDComponent = uniqueId({
    prop: 'uid',
  })(
    ({uid}) => <div id={uid('test')} />
  )

  it('passes uid', () => {
    const renderer = createRenderer()
    renderer.render(<UIDComponent />)
    let output = renderer.getRenderOutput()
    const {uid} = output.props
    expect(uid('test')).to.equal('test-1')
    expect(uid('test')).to.equal('test-1')
    expect(uid('test')).to.equal('test-1')
    expect(uid('other')).to.equal('other-2')
    renderer.render(<UIDComponent />)
    output = renderer.getRenderOutput()
    expect(uid('test')).to.equal('test-1')
    expect(uid('other')).to.equal('other-2')
  })
})
