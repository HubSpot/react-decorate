# Parameterizing decorators

Now that `counter` actually keeps a count, we need to make it a little more generalizable.
What if we need to change the name of the props it generates?

Luckily decorators can accept any number of arguments!

```javascript
const counter = makeDecorator((valueName = 'count', incName = 'incCount') => {
  const defaultValueName = `default${capitalize(valueName)}`
  let count
  return {
    displayName: () => `counter(${valueName},${setterName})`,
    propTypes: (types) => ({
      ...types,
      [defaultValueName]: PropTypes.number.isRequired,
    }),
    defaultProps: (defaults) => ({
      ...defaults,
      [defaultValueName]: 0,
    }),
    nextProps: (props, onNext) => {
      return {
        ...props,
        [valueName]: count === undefined ? props[defaultValueName] : count,
        [incName]: () => {
          count = count + 1
          onNext()
        }
      }
    },
  }
})
```

By paramterizing we allow the user to specify any prop names that might be necessary.

```javascript
const ClickCounter = counter(
  'clicks',
  'addOneClick'
)(({clicks, addOneClick}) => (
  <button onClick={addOneClick}>
    {clicks} clicks!
  </button>
));
```

## Next up

Learn about [composing decorators](./ComposingDecorators.md) by applying two `counter`s to a single component.
