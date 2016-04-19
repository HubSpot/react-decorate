import { COMPOSING } from './constants';
import invariant from 'invariant';
import React from 'react';

export function Decorated(decorators, DecoratedComponent, props) {
  const transformedProps = decorators.reduce(
    (nextProps, decorate) => decorate(nextProps),
    props
  );
  return (
    <DecoratedComponent
      {...transformedProps}
    />
  );
}

export function applyComposedDecoratorsToComponent(
  decorators,
  Component
) {
  return Decorated.bind(null, decorators, Component);
}

export function applyDecoratorToComponent(
  decorator,
  Component = COMPOSING
) {
  if (Component === COMPOSING) {
    return decorator;
  }
  return applyComposedDecoratorsToComponent([decorator], Component);
}

export function applyOptionsToDecorator(constructor, options = {}) {
  return applyDecoratorToComponent.bind(
    null,
    constructor(options)
  );
}

export default function makeDecorator(
  constructDecorator
) {
  invariant(
    typeof constructDecorator === 'function',
    'expected `constructDecorator` to be a function but got `%s`',
    constructDecorator
  );
  return applyOptionsToDecorator.bind(
    null,
    constructDecorator
  );
}
