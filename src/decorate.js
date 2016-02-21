import { enforceValidConfig } from './config'
import invariant from 'invariant'
import partial from './partial'
import React from 'react'

export function makeDisplayName(configs, BaseComponent) {
  const names = configs.reduce((ns, {getDisplayName}) => {
    if (getDisplayName) {
      ns.push(getDisplayName(BaseComponent))
    }
    return ns
  }, [])
  return `${BaseComponent.displayName}<${names.join(',')}>`
}

export function makeDecoratorComponent(configs, BaseComponent) {
  return React.createClass({
    displayName: makeDisplayName(configs, BaseComponent),

    render() {
      return <BaseComponent />
    },
  })
}

export function decorateWithConfigs(configs, BaseComponent) {
  invariant(
    Array.isArray(configs),
    'expected `configs` to be an array but got `%s`',
    configs
  )
  return makeDecoratorComponent(
    configs.map(enforceValidConfig),
    BaseComponent
  )
}

export default function decorate(...configs) {
  return partial(decorateWithConfigs, configs)
}
