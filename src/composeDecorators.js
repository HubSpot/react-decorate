import { COMPOSING } from './constants';
import { makeDecorated } from './Decorated';

export default function composeDecorators(...partialDecorators) {
  return makeDecorated.bind(
    null,
    partialDecorators.map((dec) => dec(COMPOSING))
  );
}
