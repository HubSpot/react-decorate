import { enforceValidConfig } from './config'
import invariant from 'invariant'
import partial from './partial'
import React from 'react'

function getDisplayName({displayName}) {
  displayName()
}

function reduce(key, configs, initial, ...args) {
  return configs.reduce((result, config) => {
    const operation = config[key]
    if (typeof operation !== 'function') {
      return result
    }
    return operation(result, ...args)
  }, initial)
}

export function makeDecoratorComponent(configs, BaseComponent) {
  return React.createClass({
    displayName:
      `Decorated(${BaseComponent.displayName})(${configs.map(getDisplayName)})`,

    propTypes: reduce(
      'propTypes',
      configs,
      {...BaseComponent.propTypes}
    ),

    getDefaultProps() {
      const {getDefaultProps} = BaseComponent
      return reduce(
        'defaultProps',
        configs,
        getDefaultProps ? getDefaultProps() : {}
      )
    },

    getProps() {
      return reduce(
        'step',
        configs,
        {...this.props},
        this.handleNext
      )
    },

    handleNext(config) {
      this.forceUpdate()
    },

    render() {
      return (
        <BaseComponent
          {...this.getProps()}
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
