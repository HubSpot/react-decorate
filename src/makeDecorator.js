import decorate from './decorate'
import { IS_COMPOSING } from './constants'
import invariant from 'invariant'

export default function makeDecorator(constructor) {
  invariant(
    typeof constructor === 'function',
    'expected `constructor` to be a function but got `%s`',
    constructor
  )
  return (...options) => BaseComponent => {
    const config = constructor(...options)
    if (BaseComponent === IS_COMPOSING) {
      return config
    }
    return decorate(config)(BaseComponent)
  }
}
