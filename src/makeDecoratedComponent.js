import {
  toContextTypes,
  toDisplayName,
  toDefaultProps,
  toInitialState,
  toPropTypes,
  toProps,
  toUnmount,
} from './fields';
import React, { Component } from 'react';

export default function makeDecoratedComponent(decorators, BaseComponent) {
  class DecoratedComponent extends Component {
    constructor(props) {
      super(props);
      this.handleSetState = this.handleSetState.bind(this);
      this.state = toInitialState(
        decorators,
        props,
        this.handleSetState,
        this.context
      );
    }

    componentWillUnmount() {
      toUnmount(decorators, this.props, this.state, this.context);
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
            this.handleSetState,
            this.context
          )}
        />
      );
    }
  }

  DecoratedComponent.contextTypes = toContextTypes(
    decorators,
    BaseComponent
  );

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
