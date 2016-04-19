import { META_FIELDS } from './constants';
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
  class DecoratedComponent extends Component {
    constructor(props) {
      super(props);
      this.handleSetState = this.handleSetState.bind(this);
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
  }

  META_FIELDS.forEach((fieldName) => {
    DecoratedComponent[fieldName] = decorators.reduce(
      (result, decorator) => {
        const meta = decorator[fieldName];
        return meta ? meta(result) : result;
      },
      BaseComponent[fieldName] || {}
    );
  });

  return DecoratedComponent;
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
