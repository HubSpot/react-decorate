import { expect } from 'chai'
import { shallow } from 'enzyme'
import makeDecorator from '../makeDecorator'
import React from 'react'

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
    const root = shallow(<UIDComponent />)
    const firstUid = root.prop('uid')
    expect(firstUid('test')).to.equal('test-1')
    expect(firstUid('test')).to.equal('test-1')
    expect(firstUid('test')).to.equal('test-1')
    expect(firstUid('other')).to.equal('other-2')
    root.update()
    const secondUid = root.prop('uid')
    expect(firstUid).to.equal(secondUid)
    expect(secondUid('test')).to.equal('test-1')
    expect(secondUid('other')).to.equal('other-2')
  })
})
