# Keeping state

Much like react components, decorators may keep additional state.
The second argument of the decorator function, `state`, is its current value and the third argument, `setState`, is a function you can use to update state.
Calling `setState` will trigger a re-render.

Let's add some state to the `counter` decorator.

> **Note:** unchanged snippets from the previous example are abreviated with `// ...`

```javascript
const counter = () => {
  return {
    // ...

    nextProps({defaultCount, ...props}, state, setState) {
      const currentCount = state === undefined ? defaultCount : state;
      return {
        ...props,
        count: currentCount,
        incCount: () => setState(currentCount + 1),
      };
    },
  };
};

const counterDecorator = makeDecorator(counter);
```

We added a new prop, `incCount`, which is a function that increments the count and calls `setState` which re-evaluates the HOC.

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
