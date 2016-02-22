# react-decorate

Composable, efficient, stateful decorators for React.

```javascript
import { compose, partial, uncontrolled } from 'react-decorate'

const MyComponent = ({count, partial, setCount}) => (
  <button onClick={partial(setCount, count + 1)}>
    {count} clicks
  </button>
)

export default compose(
  partial,
  uncontrolled({
    prop: 'count',
    handlerProp: 'setCount',
  })
)(MyComponent)
```
