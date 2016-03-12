import { enforceValidConfig } from './config'
import invariant from 'invariant'
import partial from './partial'
import React from 'react'

function displayName(configs, BaseComponent) {
  const decoratorNames = configs.map(({displayName}) => displayName())
  return `Decorated(${BaseComponent.displayName})(${decoratorNames})`
}

function pluck(key, configs) {
  return configs.reduce((res, config) => {
    if (config.hasOwnProperty(key)) {
      res.push(config[key])
    }
    return res
  }, [])
}

function reduce(operations, initial, ...args) {
  return operations.reduce(
    (result, operation) => operation(result, ...args),
    initial
  )
}

export function makeDecoratorComponent(configs, BaseComponent) {
  const nextProps = pluck('nextProps', configs)
  const unmounts = pluck('unmount', configs)
  return React.createClass({
    displayName: displayName(configs, BaseComponent),

    propTypes: reduce(
      pluck('propTypes', configs),
      {...BaseComponent.propTypes}
    ),

    componentWillUnmount() {
      reduce(unmounts)
    },

    getDefaultProps() {
      const {getDefaultProps} = BaseComponent
      return reduce(
        pluck('defaultProps', configs),
        typeof getDefaultProps === 'function' ? getDefaultProps() : {}
      )
    },

    getProps() {
      return reduce(
        nextProps,
        {...this.props},
        this.handleNext
      )
    },

    handleNext() {
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
