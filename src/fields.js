export function toDisplayName(decorators, BaseComponent) {
  const names = decorators.map(({displayName}) => displayName());
  return `Decorated(${names.join(' -> ')})(${BaseComponent.displayName})`;
}

export function toInitialState(decorators, props, setState, context) {
  const result = decorators.reduce((state, {initialState}, index) => {
    if (typeof initialState === 'function') {
      state[index] = initialState(
        props,
        setState.bind(null, index),
        context
      );
    }
    return state;
  }, {});
  return result;
}

export function toProps(decorators, props, state, setState, context) {
  return decorators.reduce(
    (coll, {nextProps}, index) => nextProps(
      coll,
      state[index],
      setState.bind(null, index),
      context
    ),
    props
  );
}

function applyMeta(fieldName, decorators, BaseComponent) {
  return decorators.reduce(
    (result, decorator) => {
      const meta = decorator[fieldName];
      return meta ? meta(result || {}) : result;
    },
    BaseComponent[fieldName]
  );
}

function getOriginalDefaults({defaultProps, getDefaultProps}) {
  if (defaultProps && typeof defaultProps === 'object') {
    return defaultProps;
  }
  if (typeof getDefaultProps === 'function') {
    return getDefaultProps();
  }
  return {};
}

export function toDefaultProps(decorators, BaseComponent) {
  return decorators.reduce(
    (prev, {defaultProps}) => {
      if (typeof defaultProps === 'function') {
        return defaultProps(prev);
      }
      return prev;
    },
    getOriginalDefaults(BaseComponent)
  );
}

export const toContextTypes = applyMeta.bind(null, 'contextTypes');

export const toPropTypes = applyMeta.bind(null, 'propTypes');

export function toUnmount(decorators, props, state, context) {
  decorators.forEach(({unmount}, index) => {
    if (typeof unmount === 'function') {
      unmount(props, state[index], context);
    }
  });
}
