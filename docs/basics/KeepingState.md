# Keeping state

Decorators may keep additional state.
`react-decorate` doesn't make any prescriptions about how, it simply exposes an
`onNext` function to the `nextProps` handler.
When `onNext` is called the HOC will be re-rendered.

Let's add some state to the `counter` decorator.

> **Note:** some unchanged snippets are commented out like `// ...` to help us focus on the new stuff

```javascript
const counter = makeDecorator(() => {
  let count
  return {
    // ...
    nextProps: ({defaultCount, ...props}, onNext) => ({
      ...props,
      count: count === undefined ? defaultCount : count,
      incCount: () => {
        count = count + 1
        onNext()
      }
    }),
  }
})
```

Here we're simply using a variable `count` inside the decorator to hold state.
It's worth noting that there's nothing stopping us from using a more complex pattern like a flux store, but let's keep it simple for now.

There's also a new prop, `incCount`, which is a function that increments the count and calls `onNext` which re-evaluates the HOC.

Now a component decorated with `counter` can call `incCount` to add one to the count.

```javascript
const ClickCounter = counter()(({count, incCount}) => (
  <button onClick={incCount}>
    {count} clicks!
  </button>
));
```

So rendering...

```javascript
<ClickCounter defaultCount={5} />
```

yeilds...

```html
<button>
  5 clicks!
</button>
```

and clicking the button updates to...

```html
<button>
  6 clicks!
</button>
```

## Next up

Learn about [parameterizing decorators](./ParameterizingDecorators.md) for maximum portability.
