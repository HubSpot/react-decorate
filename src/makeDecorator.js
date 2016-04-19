import invariant from 'invariant';
import React from 'react';

export function Decorated(decorate, DecoratedComponent, props) {
  return (
    <DecoratedComponent
      {...decorate(props)}
    />
  );
}

export function applyDecoratorToComponent(decorate, Component) {
  return Decorated.bind(
    null,
    decorate,
    Component
  );
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
