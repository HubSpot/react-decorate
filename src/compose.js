import decorate from './decorate'
import { IS_COMPOSING } from './compose'

export default function compose(...decorators) {
  const configs = decorators.map(decorator => decorator(IS_COMPOSING))
  return decorate(...configs)
}
