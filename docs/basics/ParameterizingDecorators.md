# Parameterizing decorators

Now that `counter` actually keeps a count, we need to make it a little more generalizable.
What if we need to change the name of the props it generates?

Luckily decorators can accept an options object!

```javascript
const counter = ({incName, valueName}) => (props, state, setState) => {
  const defaultValueName = `default${capitalize(valueName)}`
  const currentCount = count === undefined ? props[defaultValueName] : count;
  return {
    ...props,
    [valueName]: currentCount,
    [incName]: () => setState(currentCount + 1),
  }
};

counter.displayName = ({incName, valueName}) => () => {
  return `counter(${valueName},${incName})`;
};

counter.propTypes = ({valueName}) => (propTypes) => {
  const defaultValueName = `default${capitalize(valueName)}`
  return {
    ...propTypes,
    [defaultValueName]: PropTypes.number.isRequired,
  };
};

counter.defaultProps = ({valueName}) => (defaultProps) => {
  const defaultValueName = `default${capitalize(valueName)}`
  return {
    ...defaultProps,
    [defaultValueName]: 0,
  };
};

const counterDecorator = makeDecorator(counter);
```

By paramterizing we allow the user to specify any prop names that might be necessary.

```javascript
const ClickCounter = counter(
  incName: 'addOneClick',
  valueName: 'clicks',
)(({clicks, addOneClick}) => (
  <button onClick={addOneClick}>
    {clicks} clicks!
  </button>
));
```

## Next up

Learn about [composing decorators](./ComposingDecorators.md) by applying two `counter`s to a single component.
