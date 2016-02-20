/* @flow */
import type { Applicable } from './types'

import React from 'react'

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