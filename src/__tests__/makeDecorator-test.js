import { expect } from 'chai'
import { IS_COMPOSING } from '../constants'
import makeDecorator from '../makeDecorator'

describe('makeDecorator', () => {
  it('throws for invalid input', () => {
    expect(() => makeDecorator({})).to.throw()
  })

  it('returns a function', () => {
    expect(makeDecorator(() => {})).to.be.a('function')
  })

  it('return a function that returns a config if composing', () => {
    const config = {}
    const decorator = makeDecorator(() => config)
    expect(decorator()(IS_COMPOSING)).to.equal(config)
  })

  it('accepts multiple options', () => {
    let receivedOptions
    const decorator = makeDecorator((...options) => {
      receivedOptions = options
    })
    decorator(1, 2, 3, 4)(IS_COMPOSING)
    expect(receivedOptions).to.deep.equal([1, 2, 3, 4])
  })
})
