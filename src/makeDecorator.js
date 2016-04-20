import { COMPOSING } from './constants';
import { makeDecoratedComponent } from './decorate';
import enforceDecorator from './enforceDecorator';
import invariant from 'invariant';

export function applyDecoratorToComponent(
  decorator,
  Component = COMPOSING
) {
  if (Component === COMPOSING) {
    return decorator;
  }
  return makeDecoratedComponent([decorator], Component);
}

export function applyOptionsToDecorator(constructor, ...options) {
  return applyDecoratorToComponent.bind(
    null,
    enforceDecorator(constructor(...options))
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
