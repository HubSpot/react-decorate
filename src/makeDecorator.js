import { COMPOSING } from './constants';
import { makeDecorated } from './Decorated';
import invariant from 'invariant';

export function applyDecoratorToComponent(
  decorator,
  Component = COMPOSING
) {
  if (Component === COMPOSING) {
    return decorator;
  }
  return makeDecorated([decorator], Component);
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
