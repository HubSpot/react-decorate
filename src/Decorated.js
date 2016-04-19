import React, { Component } from 'react';

function transformProps(decorators, props, state, setState) {
  return decorators.reduce(
    (nextProps, decorate, index) => decorate(
      nextProps,
      state[index],
      setState.bind(null, index)
    ),
    props
  );
}

export function makeDecorated(decorators, BaseComponent) {
  return class DecoratedComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    handleSetState(fieldName, value) {
      this.setState({[fieldName]: value});
    }

    render() {
      return (
        <BaseComponent
          {...transformProps(
            decorators,
            this.props,
            this.state,
            this.handleSetState
          )}
        />
      );
    }
  };
}

export default function Decorated(
  decorators,
  DecoratedComponent,
  props
) {
  return (
    <DecoratedComponent
      {...transformProps(decorators, props)}
    />
  );
}
