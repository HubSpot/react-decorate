import { expect } from 'chai'
import partial from '../partial'

const returnArgs = (...args) => args
const range = (length) => {
  let r = []
  for (let i = 1; i <= length; i++) {
    r.push(i)
  }
  return r
}

describe('partial', () => {
  for (let i = 1; i <= 10; i++) {
    it(`applies ${i} argument(s)`, () => {
      let args = range(i)
      let partialed = partial(returnArgs, ...args)
      expect(partialed()).to.deep.equal(args)
    })
  }
})
