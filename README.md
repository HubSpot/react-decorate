# react-decorate

`react-decorate` aims to help you build composable, stateful decorators for React components.

## Diving in

`makeDecorator` is the bread and butter of the react-decorate api.
It takes a function that returns `DecoratorConfig`, and returns a curried decorator function.

For example, let's create a decorator that creates a persistent `uniqueId` function we can use in our components.
This could be useful for making `<label>`s that don't contain their `<input>`s.

```javascript
// persistentUniqueId.js
import { makeDecorator } from 'react-decorate'

let nextId = 1
export default makeDecorator((propName = 'uniqueId') => {
  let idCache = {}
  const uniqueId = (idKey) => {
    if (!idCache.hasOwnProperty(idKey)) {
      idCache[idKey] = `pid-${idKey}-${nextId++}`
    }
    return idCache[idKey]
  }
  return { // this object is a DecoratorConfig
    displayName: () => 'uniqueId',
    step: (props) => ({
      ...props,
      [propName]: uniqueId,
    }),
  }
})
```

This decorator is pretty simple, but let's break down each part of the config.

A decorator has a chance to intercept and augment the props that will be passed to the base component.
A decorator may also augement static properties of a component class like prop types, and default prop values.
Each decorator is required to define a function that returns a displayName so `react-decorate` can generate a descriptive displayName for the higher order component.

```javascript
// ...
  return {
    // our higher order component's displayName will be `Decorated(uniqueId)(BaseComponent)`
    displayName: () => propName,
    // ...
  }
// ...
```

`nextProps` is the most useful decorator parameter.
It allows us to add, alter, or remove props before they're passed to our base component.

```javascript
// ...
  return {
    // ...
    nextProps: (props) => ({
      // in this case we pass through all the existing props
      ...props,
      // and add a new one containing our uniqueId function
      [propName]: uniqueId,
    }),
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

## Composition with `composeDecorators`

The best part is that decorators created with `react-decorate` are composable.
If we had another decorator called `counter` and we wanted to apply both `counter` and `persistentUniqueId` to our component that would be easy.
`counter` adds two props.
One is the `count` so far and the other is a function that allows us to increment the count.
`composeDecorators` handles that for us!

```javascript
import counter from './counter'
import persistentUniqueId from './persistentUniqueId'
import { composeDecorators } from 'react-decorate'

const MyForm = ({count, incCount, uniqueId}) => (
  <div>
    <label htmlFor={uniqueId('name')}>Name</label>
    <input name={uniqueId('name')} />
    <button onClick={incCount}>
      {count} clicks
    </button>
  </div>
)

export default composeDecorators(
  counter('count', 'incCount'),
  persistentUniqueId('uniqueId')
)(MyForm);
`
```
