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
})
