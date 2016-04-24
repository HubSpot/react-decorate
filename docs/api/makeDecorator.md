## makeDecorator(decoratorFactory)

Takes a function that creates a `DecoratorConfig` and returns a decorator function which can be applied to a component or [composed](/docs/api/composeDecorators.md).

#### Arguments

1. `decoratorFactory` *(Function)*: a function that returns a new [DecoratorConfig](/docs/api/DecoratorConfig.md).

#### Returns

*(Function)* A decorator function that can be configured and then applied to a component.
