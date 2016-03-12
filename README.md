# react-decorate

[![npm version](https://badge.fury.io/js/react-decorate.svg)](https://badge.fury.io/js/react-decorate)
[![Build status](https://api.travis-ci.org/HubSpot/react-decorate.svg)](https://travis-ci.org/HubSpot/react-decorate)

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
    nextProps: (props) => ({
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

## Updating state with `onNext`

Let's create a counter decorator that passes some state (a counter) and also a function that can be used to increment that count.
We can use the `onNext` function that's passed to `nextProps` to cause our decorator to be re-evaluated.

```javascript
const counter = makeDecorator((
  valueName = 'count',
  incName = 'incCount'
) => {
  let count = 0
  return {
    displayName: () => `counter(${valueName},${incName})`,
    nextProps: (props, onNext) => ({
      ...props,
      [valueName]: count,
      [incName]: () => {
        count += 1
        onNext() // trigger a re-render
      },
    }),
  }
})
```

Now we could use that to creact a button that displays how many times it's been clicked.

```javascript
const ClickCounter = counter(
  'clickCount',
  'incClickCount'
)(({clickCount, incClickCount}) => (
  <button onClick={incClickCount}>
    {clickCount} clicks!
  </button>
))
```

## Composition with `composeDecorators`

The best part is that decorators created with `react-decorate` are composable.
Using `composeDecorators` we can apply both the `counter` and `persistentUniqueId` decorators to our component, while only creating one additional wrapper component.

```javascript
import counter from './counter'
import persistentUniqueId from './persistentUniqueId'
import { composeDecorators } from 'react-decorate'

const MyForm = ({clickCount, incClickCount, uniqueId}) => (
  <div>
    <label htmlFor={uniqueId('name')}>Name</label>
    <input name={uniqueId('name')} />
    <button onClick={incClickCount}>
      {clickCount} clicks
    </button>
  </div>
)

export default composeDecorators(
  counter('clickCount', 'incClickCount'),
  persistentUniqueId('uniqueId')
)(MyForm);
`
```
