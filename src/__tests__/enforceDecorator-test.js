import { expect } from 'chai';
import enforceDecorator from '../enforceDecorator';

const validBaseDecorator = {
  displayName: () => {},
  nextProps: () => {},
};

describe('enforceDecorator', () => {
  describe('required fields', () => {
    ['displayName', 'nextProps'].forEach((fieldName) => {
      it(fieldName, () => {
        expect(() => {
          enforceDecorator({
            ...validBaseDecorator,
            [fieldName]: undefined,
          });
        }).to.throw();
        expect(() => {
          enforceDecorator(validBaseDecorator);
        }).not.to.throw();
      });
    });
  });

  describe('optional fields', () => {
    ['defaultProps', 'initialState', 'propTypes'].forEach((fieldName) => {
      it(fieldName, () => {
        expect(() => {
          enforceDecorator({
            ...validBaseDecorator,
            [fieldName]: {},
          });
        }).to.throw();
        expect(() => {
          enforceDecorator({
            ...validBaseDecorator,
            [fieldName]: undefined,
          });
        }).not.to.throw();
        expect(() => {
          enforceDecorator({
            ...validBaseDecorator,
            [fieldName]: () => {},
          });
        }).not.to.throw();
      });
    });
  });
});
