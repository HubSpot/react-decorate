import invariant from 'invariant';

export default function enforceDecorator(decorator) {
  invariant(
    decorator && typeof decorator === 'object',
    'expected `decorator` to be an object but got `%s`',
    decorator
  );
  invariant(
    typeof decorator.displayName === 'function',
    'expected `decorator.displayName` to be a function but got `%s`',
    decorator.displayName
  );
  invariant(
    typeof decorator.nextProps === 'function',
    'expected `decorator.nextProps` to be a function but got `%s`',
    decorator.nextProps
  );
  return decorator;
}
