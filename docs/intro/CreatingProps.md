# Creating props

At their most basic, react decorators can create one more more new props and pass them down to the base component.

```javascript
import { makeDecorator } from 'react-decorate'

const googleUrlProp = makeDecorator(() => ({
  displayName: () => 'testProp',
  nextProps: (props) => ({
    ...props,
    googleUrl: 'http://google.com',
  }),
}))
```

`displayName` is a function that returns a string identifying the decorator in the HOC's `displayName`.

`nextProps` is run each time our HOC is re-rendered.
Its first argument is either the props that were passed to the HOC or, in the case of a composed decorator, the result of the previous decorators `nextProps`.

Now if we decorate a component with `googleUrlProp`, that component will receive a prop named `googleUrl` with a value of `"http://google.com"`.

```javascript
export default googleUrlProp()(({googleUrl}) => (
  <a href={googleUrl}>
    Go to Google
  </a>
);
```

This component would render markup like...

```html
<a href="http://google.com">
  Go to Google
</a>
```
