# react-decorate

`react-decorate` aims to help you build composable, stateful decorators for React components.

## Diving in

`makeDecorator` is the bread and butter of the react-decorate api.
It takes a function that returns `DecoratorConfig`, and returns a curried decorator function.

For example, let's create a decorator that creates a persistent `uniqueId` function we can use in our components.
This could be useful for making a `<form>` where the `<label>`s are separated from their `<input>`s.

```javascript
// persistentUniqueId.js
import { makeDecorator } from 'react-decorate'

let nextId = 1
export default makeDecorator((propName) => {
  return { // this object is a DecoratorConfig
    getPropName() {
      return propName
    },

    getInitialState() {
      let idCache = {}
      return (idKey) => {
        if (!idCache.hasOwnProperty(idKey)) {
          idCache[idKey] = `pid-${idKey}-${nextId++}`
        }
        return idCache[idKey]
      }
    },
  }
})
```

Let's break down each part of this config.

Each decorator generates a value that will be passed to the decorated component via a prop.
`getPropName` returns a string which is the name of the prop that will be passed to the decorated component.
In most cases, this name will be a parameter of the constructor function for easy customization.

```javascript
// ...
  return {
    getPropName() {
      // our persistentUniqueId function will be accessible in the decorated
      // components at `this.props.uniqueId` (in the default case)
      return propName
    },
    // ...
  }
}
```

A `DecoratorConfig` may define a subset of the react lifecycle methods. 
It looks a bit like a regular react mixin, but each method returns a value instead of triggering a side effect with set state.
Since the value of `persistentUniqueId` won't change over time we can defined it just in terms of `getInitialState`.

```javascript
// ...
  return {
    // ...
    getInitialState() {
      let idCache = {}
      // we return a uniqueId function that closes over an idCache
      // we could also use something like `_.memoize`
      return (idKey) => {
        if (!idCache.hasOwnProperty(idKey)) {
          idCache[idKey] = `pid-${idKey}-${nextId++}`
        }
        return idCache[idKey]
      }
    },
  }
// ...
```

And that's it. Now we can use our `persistentUniqueId` decorator to inject a stateful `uniqueId` function into a stateless component.

```javascript
import persistentUniqueId from './persistentUniqueId'

const MyForm = ({uniqueId}) => (
  <form>
    <label htmlFor={uniqueId('name')}>Name</label>
    <input name={uniqueId('name')} />
  </form>
)

export default persistentUniqueId('uniqueId')(MyForm);
```
