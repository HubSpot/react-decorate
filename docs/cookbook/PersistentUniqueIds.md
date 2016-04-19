# Persistent unique ids

As we strive to make our web applications more accessible, unique identifiers are an important tool in our arsenal.
However, generating unique ids in react `render` methods is not as simple as it was once was.

Because a component's `render` method can be called any number of times over the course of a its lifecycle, a normal id generator like `_.uniqueId` won't suffice on it's own.
We need to cache the ids to ensure that they persist for the entire life of the component.
Rather than manually caching each id, we can write a decorator which memoizes our unique ids and releases it's cache when the component it was applied to is unmounted.

```javascript
// persistentUniqueId.js
import { makeDecorator } from 'react-decorate';

const defaultPropName = 'uniqueId';

export persistentUniqueId = ({propName}) => (props, unqiueId) => {
  return {
    ...props,
    [propName]: uniqueId,
  };
};

let nextId = 0
persistentUniqueId.initialState = () => () => {
  const cache = {};
  return function uniqueId(cache, keyStr) {
    if (!cache.hasOwnProperty(keyStr)) {
      cache[keyStr] = `uid-${keyStr}-${nextId++}`];
    }
    return cache[keyStr];
  };
};

persistentUniqueId.displayName = ({propName}) => () => {
  return propName === defaultPropName ?
    defaultPropName :
    `${defaultPropName}(${propName})`;
};

export default makeDecorator(persistentUniqueId);
```

Now a component decorated with `persistentUniqueId` will receive a `uniqueId` function as a prop.

```javascript
import persistentUniqueId from './persistentUniqueId'

export default persistentUniqueId('uniqueId')(({uniqueId}) => (
  <form>
    <label htmlFor={uniqueId('username')}>Username</label>
    <input name={uniqueId('username')} />
    <label htmlFor={uniqueId('password')}>Password</label>
    <input name={uniqueId('password')} />
  </form>
))
```

Each time an instance of our component is rendered we'll get the same uid back for each string key.

```html
<form>
  <label form="uid-username-0">Username</label>
  <input name="uid-username-0" />
  <label form="uid-password-1">Password</label>
  <input name="uid-password-1" />
</form>
```

Another instance of the same component will receive similarly named, but unique ids from it's sibling.

```html
<form>
  <label form="uid-username-2">Username</label>
  <input name="uid-username-2" />
  <label form="uid-password-3">Password</label>
  <input name="uid-password-3" />
</form>
```
