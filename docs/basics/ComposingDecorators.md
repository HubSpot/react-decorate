## Composing decorators

Remember way back to the begining of this guide, the [introduction](/docs/Introduction.md) mentioned that `react-decorator` decorators are composable.
Lucky for us, we don't need to write any new code to compose decorators.
All we need to do is import the `composeDecorators` helper from `react-decorate`.

Let's make a new component that has two counters.

```javascript
import { composeDecorators } from 'react-decorate'

const ClickAndHoverCounter = composeDecorators(
  counter('clickCount', 'incClicks'),
  counter('hoverCount', 'incHovers')
)(({
  clickCount,
  hoverCount,
  incClicks,
  incHovers,
}) => (
  <button
    onClick={incClicks}
    onMouseEnter={incHovers}>
    {clickCount} clicks and {hoverCount} hovers
  </button>
))
```

We can compose any number of decorators this way and each is applied in the order that they're passed to `composeDecorators` so layering behaviors is simple.

## Further reading

For more concrete examples, check out the [cookbook section](../cookbook/README.md).
