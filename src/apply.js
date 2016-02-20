/* @flow */
import React from 'react'
import type { Applicable } from './types'

type Applier = (BaseComponent: ReactClass) => ReactClass

export default function Apply(
  ...args: Array<Applicable>
): Applier {
  return (BaseComponent: ReactClass): ReactClass => {
    return React.createClass({
      render() {
        return <BaseComponent />
      },
    })
  }
}
