import makeDecorator from '../makeDecorator';

const defaultPropName = 'uniqueId';

const persistentUniqueId = ({propName}) => (props, uniqueId) => {
  return {
    ...props,
    [propName]: uniqueId,
  };
};

persistentUniqueId.displayName = ({propName}) => () => {
  return propName === defaultPropName ?
    defaultPropName :
    `${defaultPropName}(${propName})`;
};

let nextId = 0;

persistentUniqueId.initialState = () => () => {
  const cache = {};
  return function uniqueId(keyStr) {
    if (!cache.hasOwnProperty(keyStr)) {
      cache[keyStr] = `uid-${keyStr}-${nextId++}`;
    }
    return cache[keyStr];
  };
};

persistentUniqueId.propTypes = ({propName}) => (propTypes) => {
  const nextPropTypes = {...propTypes};
  delete nextPropTypes[propName];
  return nextPropTypes;
};

export default makeDecorator(persistentUniqueId);
