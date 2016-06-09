import invariant from 'invariant';

function field(fieldName, decorator) {
  invariant(
    typeof decorator[fieldName] === 'function',
    'expected `decorator.%s` to be a function but got `%s`',
    fieldName,
    decorator[fieldName]
  );
}

function optionalField(fieldName, decorator) {
  invariant(
    !decorator[fieldName] || typeof decorator[fieldName] === 'function',
    'expected `decorator.%s` to be an optional function but got `%s`',
    fieldName,
    decorator[fieldName]
  );
}

export default function enforceDecorator(decorator) {
  field('displayName', decorator);
  optionalField('defaultProps', decorator);
  optionalField('initialState', decorator);
  optionalField('propTypes', decorator);
  field('nextProps', decorator);
  return decorator;
}
