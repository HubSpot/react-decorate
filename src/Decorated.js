import React from 'react';

function transformProps(decorators, props) {
  return decorators.reduce(
    (nextProps, decorate) => decorate(nextProps),
    props
  );
}

export default function Decorated(
  decorators,
  DecoratedComponent,
  props
) {
  return (
    <DecoratedComponent
      {...transformProps(decorators, props)}
    />
  );
}
