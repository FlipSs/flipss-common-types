import {Argument} from "../../../src/utils";

describe('Argument tests', () => {

  describe('isNotNullOrUndefined', () => {
    const parameterName = 'test';

    it('Must throw error on null', () => {
      expect(() => Argument.isNotNullOrUndefined(null, parameterName))
          .toThrow()
    });

    it('Must throw error on undefined', () => {
      expect(() => Argument.isNotNullOrUndefined(undefined, parameterName))
          .toThrow()
    });

    it('Must not throw error on 0', () => {
      expect(() => Argument.isNotNullOrUndefined(0, parameterName))
          .not.toThrow()
    });

    it('Must not throw error on ""', () => {
      expect(() => Argument.isNotNullOrUndefined('', parameterName))
          .not.toThrow()
    });

    it('Must not throw error on {}', () => {
      expect(() => Argument.isNotNullOrUndefined({}, parameterName))
          .not.toThrow()
    });

    it('Must not throw error on obj', () => {
      expect(() => Argument.isNotNullOrUndefined({test: parameterName}, parameterName))
          .not.toThrow()
    });
  });
});
