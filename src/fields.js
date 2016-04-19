export function toDisplayName(decorators, BaseComponent) {
  const names = decorators.map(({displayName}) => displayName());
  return `Decorated(${names.join(' -> ')})(${BaseComponent.displayName})`;
}

export function toInitialState(decorators, props, setState) {
  return decorators.reduce((state, {initialState}, index) => {
    if (typeof initialState === 'function') {
      state[index] = initialState(
        props,
        setState,
        setState.bind(null, index)
      );
    }
    return state;
  }, {});
}

export function toProps(decorators, props, state, setState) {
  return decorators.reduce(
    (nextProps, decorate, index) => decorate(
      nextProps,
      state[index],
      setState.bind(null, index)
    ),
    props
  );
}

function applyMeta(fieldName, decorators, BaseComponent) {
  return decorators.reduce(
    (result, decorator) => {
      const meta = decorator[fieldName];
      return meta ? meta(result) : result;
    },
    BaseComponent[fieldName] || {}
  );
}

export const toDefaultProps = applyMeta.bind(null, 'defaultProps');

export const toPropTypes = applyMeta.bind(null, 'propTypes');

export function toUnmount(decorators, props, state) {
  decorators.forEach(({unmount}) => {
    if (typeof unmount === 'function') {
      unmount(props, state);
    }
  });
}
