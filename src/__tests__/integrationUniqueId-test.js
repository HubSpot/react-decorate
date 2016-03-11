import { expect } from 'chai'
import makeDecorator from '../makeDecorator'
import React from 'react'
import { createRenderer } from 'react-addons-test-utils'

describe('example: UniqueIds', () => {
  let nextId = 1
  const uniqueId = makeDecorator((propName = 'uniqueId') => {
    let idCache = {}
    const uniqueId = (idKey) => {
      if (!idCache.hasOwnProperty(idKey)) {
        idCache[idKey] = `${idKey}-${nextId++}`
      }
      return idCache[idKey]
    }
    return { // this object is a DecoratorConfig
      displayName: () => propName,
      nextProps: (props) => ({
        ...props,
        [propName]: uniqueId,
      }),
    }
  })

  const UIDComponent = uniqueId(
    'uid'
  )(
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
