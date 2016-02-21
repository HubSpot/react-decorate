import invariant from 'invariant'
import partial from './partial'
import React from 'react'

export function applyConfigs(configs, BaseComponent) {
  invariant(
    Array.isArray(configs),
    'expected `configs` to be an array but got `%s`',
    configs
  )
  return React.createClass({
    render() {
      return <BaseComponent />
    },
  })
}

export default function apply(...configs) {
  return partial(applyConfigs, configs)
}
