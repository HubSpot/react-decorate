import React from 'react'

export default function apply(...configs) {
  return BaseComponent => {
    return React.createClass({
      render() {
        return <BaseComponent />
      },
    })
  }
}
