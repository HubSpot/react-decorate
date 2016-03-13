# Transforming props

Decorators may read or change any number of the props passed to the HOC.
A decorator can even provide additional propTypes to ensure the API of the HOC is clear.

```javascript
import { PropTypes } from 'react'

const incrementProp = (propName) => ({
  displayName: () => `increment(${propName})`,
  propTypes: (types) => ({
    ...types,
    [propName]: PropTypes.number.isRequired,
  }),
  nextProps: (props) => ({
    ...props,
    [propName]: props[propName] + 1,
  }),
})
```

In `propTypes`, the `incrementProp` decorator adds a propType to ensure that the prop it's expecting is defined.
In `nextProps` it increments the value of the prop.
Notice that the name of the actual prop, i.e. `propName`, is parameterized to allow the decorator to be applied multiple times.

Usage of this decorator might look something like this...

```javascript
const NumberPlusOne = incrementProp(
  'number'
)(
  ({number}) => <span>{number}</span>
)
```

If we rendered `NumberPlusOne` like...

```javascript
<NumberPlusOne number={9} />
```

The rendered markup would look like...

```html
<span>{10}</span>
```
