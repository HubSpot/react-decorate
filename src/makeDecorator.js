import { COMPOSING, META_FIELDS } from './constants';
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
  const decorator = constructor(options);
  META_FIELDS.forEach((field) => {
    if (typeof constructor[field] === 'function') {
      decorator[field] = constructor[field](options);
    }
  });
  return applyDecoratorToComponent.bind(null, decorator);
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
