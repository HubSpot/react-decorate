import invariant from 'invariant';

export default function makeDecorator(
  decorator
) {
  invariant(
    typeof decorator === 'function',
    'expected `decorator` to be a function but got `%s`',
    decorator
  );
}
