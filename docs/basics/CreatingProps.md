# Creating props

At their most basic, react decorators can create one more more new props and pass them down to the base component.

```javascript
import { makeDecorator } from 'react-decorate'

const counter = () => (props) => {
  return {
    ...props,
    count: 0,
  };
};

counter.displayName = () => () => 'counter';

const counterDecorator = makeDecorator(counter);
```

`counter` is a function factory whos result is run each time our HOC is re-rendered.
The `props` argument is either the props that were passed to the HOC or, in the case of a composed decorator, the result of the previous decorators.

`displayName` is a function factory that returns a string identifying the decorator in the HOC's `displayName`.

Now if we decorate a component with `counterDecorator`, it will receive a prop named `count` with a value of `0`.

```javascript
const ClickCounter = counterDecorator()(
  ({count}) => <button>{count} clicks!</button>
);
```

Now if we render `ClickCounter` like...

```javascript
<ClickCounter />
```

It's markup will look like...

```html
<button>
  0 clicks!
</button>
```

## Next up

Learn about [transforming props](./TransformingProps.md) and adding propTypes by adding a `defaultCount` prop to our HOC.
