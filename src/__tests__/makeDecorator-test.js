jest.dontMock('../makeDecorator')

describe('makeDecorator', () => {
  let IS_COMPOSING = require('../constants').IS_COMPOSING
  let makeDecorator

  beforeEach(() => {
    makeDecorator = require('../makeDecorator').default
  })

  it('throws for invalid input', () => {
    expect(() => makeDecorator({})).toThrow()
  })

  it('returns a function', () => {
    expect(typeof makeDecorator(() => {})).toBe('function')
  })

  it('return a function that returns a config if composing', () => {
    const config = {}
    const decorator = makeDecorator(() => config)
    console.log(decorator)
    expect(decorator()(IS_COMPOSING)).toBe(config)
  })
})
