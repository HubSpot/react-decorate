import { enforceValidConfig } from './config'
import invariant from 'invariant'
import partial from './partial'
import React from 'react'

function extend(base, merge) {
  for (let key in merge) {
    base[key] = merge[key]
  }
  return base
}

function runMulti(configs, cycleName, ...args) {
  return configs.reduce((state, config) => {
    const cycle = config[cycleName]
    if (typeof cycle === 'function') {
      extend(state, cycle(...args))
    }
    return state
  }, {})
}

function runCycle(configs, cycleName, props, state, BaseComponent) {
  return configs.reduce((state, config) => {
    const cycle = config[cycleName]
    if (typeof cycle === 'function') {
      const name = config.getPropName()
      state[name] = cycle(props, state[name], BaseComponent)
    }
    return state
  }, {})
}

function filterPropTypes(configs, BaseComponent) {
  let filtered = {...BaseComponent.propTypes}
  configs.forEach(({getHandlerName, getPropName}) => {
    if (getHandlerName) {
      delete filtered[getHandlerName(BaseComponent)]
    }
    if (getPropName) {
      delete filtered[getPropName(BaseComponent)]
    }
  })
  return filtered
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

    propTypes: {
      ...filterPropTypes(configs, BaseComponent),
      ...runMulti(configs, 'getPropTypes', BaseComponent),
    },

    getDefaultProps() {
      const {getDefaultProps} = BaseComponent
      const baseDefaultProps = getDefaultProps ? getDefaultProps() : {}
      return {
        ...baseDefaultProps,
        ...runMulti(configs, 'getDefaultProps', BaseComponent),
      }
    },

    getInitialState() {
      return {
        ...run('getInitialState', this.props, {}, BaseComponent),
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
          handleChange(this.props, ...args) :
          args[0],
      })
    },

    componentWillMount() {
      this.setState(
        run('componentWillMount', this.props, this.state, BaseComponent)
      )
    },

    componentWillReceiveProps(nextProps) {
      this.setState(
        run('componentWillReceiveProps', nextProps, this.state, BaseComponent)
      )
    },

    componentWillUnmount() {
      run('componentWillUnmount', this.props, this.state, BaseComponent)
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
