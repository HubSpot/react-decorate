## composeDecorators(...decorators)

Combines `n` decorators into a single decorator which can be applied with 1 component instead of `n` components.

#### Arguments

`...decorators` *(arguments)*: any number of configured decorators.

#### Returns

*(Function)* A react component decorator that takes a base component and returns a new component which applies the behaviors defined in `decorators`.

### Example: Apply two decorators

```javascript
import counter from 'example/counter-decorator';
import React from 'react';
import { composeDecorators } from 'react-decorate';

const CounterButtons = ({noCount, noInc, yesCount, yesInc}) => {
  return (
    <div>
      <button onClick={yesInc}>
        Yes ({yesCount})
      </button>
      <button onClick={noInc}>
        No ({noCount})
      </button>
    </div>
  );
};

export default composeDecorators(
  counter('noCount', 'noInc'),
  counter('yesCount', 'yesInc'),
)(CounterButtons);
```
