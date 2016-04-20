import {
  toDisplayName,
  toDefaultProps,
  toInitialState,
  toPropTypes,
  toProps,
  toUnmount,
} from './fields';
import React, { Component } from 'react';

export function makeDecoratedComponent(decorators, BaseComponent) {
  class DecoratedComponent extends Component {
    constructor(props) {
      super(props);
      this.handleSetState = this.handleSetState.bind(this);
      this.state = toInitialState(
        decorators,
        props,
        this.handleSetState
      );
    }

    componentWillUnmount() {
      toUnmount(decorators, this.props, this.state);
    }

    handleSetState(fieldName, value) {
      this.setState({[fieldName]: value});
    }

    render() {
      return (
        <BaseComponent
          {...toProps(
            decorators,
            this.props,
            this.state,
            this.handleSetState
          )}
        />
      );
    }
  }

  DecoratedComponent.displayName = toDisplayName(
    decorators,
    BaseComponent
  );

  DecoratedComponent.defaultProps = toDefaultProps(
    decorators,
    BaseComponent
  );

  DecoratedComponent.propTypes = toPropTypes(
    decorators,
    BaseComponent
  );

  return DecoratedComponent;
}
