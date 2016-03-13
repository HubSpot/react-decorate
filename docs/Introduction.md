# Introduction

Higher-order-components (from here on out referred to as HOCs) have become an increasingly popular pattern in react applications.
They offer a better encapsulated alternative to mixins and are compatible with classical or stateless component declarations.
Popular libraries like [react-redux](https://github.com/reactjs/react-redux) and [recompose](https://github.com/acdlite/recompose) use HOCs to augement react components with special behaviors.

Unfortunately to date when using HOCs, each decorator adds another component layer to the render tree.
A component that applies 2 HOC behaviors will have 3 instances in the tree.
A component that applies 3 HOC behaviors will have 4 instances in the tree.
And so on and so forth.
As we continue to push the limits of React, these additional instances can have [a meaningful impact on performance](https://youtu.be/kDARP5QZ6nU) in our applications.

`react-decorate` is intended as a simple framework for creating composable and efficient HOC decorators.
Any number of `react-decorate` HOCs can be appied to a component while only adding 1 additional component instance.
