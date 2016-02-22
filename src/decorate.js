import { enforceValidConfig } from './config'
import invariant from 'invariant'
import partial from './partial'
import React from 'react'

function extend(target, object) {
  for (let key in object) {
    target[key] = object[key]
  }
  return target
}

function runCycle(configs, cycleName, ...args) {
  return configs.reduce((state, config) => {
    const cycle = config[cycleName]
    if (typeof cycle !== 'function') {
      return state
    }
    return extend(state, cycle(...args))
  }, {})
}

export function makeDisplayName(configs, BaseComponent) {
  const names = configs.reduce((ns, {getDisplayName}) => {
    if (getDisplayName) {
      ns.push(getDisplayName(BaseComponent))
    }
    return ns
  }, [])
  return `${BaseComponent.displayName}<${names.join(', ')}>`
}

export function makeDecoratorComponent(configs, BaseComponent) {
  const run = partial(runCycle, configs)
  return React.createClass({
    displayName: makeDisplayName(configs, BaseComponent),

    propTypes: run('getPropTypes', BaseComponent),

    getInitialState() {
      return run('getInitialState', this.props, BaseComponent)
    },

    render() {
      return (
        <BaseComponent
          {...this.props}
          {...this.state}
        />
      )
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
