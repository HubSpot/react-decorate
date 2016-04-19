import { COMPOSING } from './constants';
import { applyComposedDecoratorsToComponent } from './makeDecorator';

export default function composeDecorators(...partialDecorators) {
  return applyComposedDecoratorsToComponent.bind(
    null,
    partialDecorators.map((dec) => dec(COMPOSING))
  );
}
