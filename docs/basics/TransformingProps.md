# Transforming props

Decorators may read or change any number of the props passed to the HOC.
A decorator can even provide additional propTypes and defaults to ensure the API of the HOC is clear.

Let's add a `defaultCount` prop to the decorator from the previous example.

```javascript
import { PropTypes } from 'react'

const counter = () => ({defaultCount, ...props}) => {
  return {
    ...props,
    count: defaulCount,
  };
};

counter.displayName = () => () => {
  return 'counter';
};

counter.propTypes = () => (propTypes) => {
  return {
    ...propTypes,
    defaultCount: PropTypes.number.isRequired,
  };
};

counter.defaultProps = () => (defaultProps) => {
  return {
    ...defaultProps,
    defaultCount: 0,
  };
};

const counterDecorator = makeDecorator(counter);
```

In `propTypes`, decorator adds a `defaultCount` propType to ensure that the prop it's expecting is defined.
In `defaultProps`, it sets the default value of `defaultCount` to `0`.
In `nextProps` it renames `defaultCount` to `count`.

Now if we decorate a component with `counter`, that component will receive a prop named `count` with a value of `0` or whatever `defaultCount` was provided.

```javascript
const ClickCounter = counterDecorator()(
  ({count}) => <button>{count} clicks!</button>
);
```

If we rendered `ClickCounter` like...

```javascript
<ClickCounter defaultCount={5} />
```

The rendered markup would look like...

```html
<button>
  5 clicks!
</button>
```

## Next up

Learn about [tracking state](./KeepingState.md) by exporting an `incrementCount` prop from `counter`.
