import { enforceValidConfig } from './config'
import invariant from 'invariant'
import partial from './partial'
import React from 'react'

function runCycle(configs, cycleName, ...args) {
  return configs.reduce((state, config) => {
    const cycle = config[cycleName]
    if (typeof cycle === 'function') {
      state[config.getPropName()] = cycle(...args)
    }
    return state
  }, {})
}

export function makeDisplayName(configs, BaseComponent) {
  const names = configs.reduce((ns, {getPropName}) => {
    if (getPropName) {
      ns.push(getPropName(BaseComponent))
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
      return {
        ...run('getInitialState', this.props, BaseComponent),
        ...this.getHandlers(),
      }
    },

    getHandlers() {
      return configs.reduce((handlers, config) => {
        const {getHandlerName} = config
        if (typeof getHandlerName === 'function') {
          handlers[getHandlerName(BaseComponent)] = partial(
            this.handleChange,
            config
          )
        }
        return handlers
      }, {})
    },

    handleChange(config, ...args) {
      const {handleChange} = config
      this.setState({
        [config.getPropName]: typeof handleChange === 'function' ?
          handleChange(...args) :
          args[0],
      })
    },

    componentWillMount() {
      this.setState(
        run('componentWillMount', this.props, BaseComponent)
      )
    },

    componentWillReceiveProps(nextProps) {
      this.setState(
        run('componentWillReceiveProps', nextProps, BaseComponent)
      )
    },

    componentWillUnmount() {
      run('componentWillUnmount', this.props, BaseComponent)
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
