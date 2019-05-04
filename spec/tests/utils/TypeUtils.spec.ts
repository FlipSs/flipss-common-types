import {TypeUtils} from "../../../src/utils";

describe('TypeUtils', () => {

  describe('isNullOrUndefined', () => {
    it('Should be true if undefined', () => {
      expect(TypeUtils.isNullOrUndefined(undefined)).toBeTruthy();
    });

    it('Should be true if null', () => {
      expect(TypeUtils.isNullOrUndefined(null)).toBeTruthy();
    });

    it('Should be false if 0', () => {
      expect(TypeUtils.isNullOrUndefined(0)).toBeFalsy();
    });

    it('Should be false if ""', () => {
      expect(TypeUtils.isNullOrUndefined('')).toBeFalsy();
    });

    it('Should be false if obj', () => {
      expect(TypeUtils.isNullOrUndefined({test: 'test'})).toBeFalsy();
    });
  });

  describe('is', () => {
    it('Should be true if type of value equals expected type', () => {
      expect(TypeUtils.is([], Array)).toBeTruthy();
    });

    it('Should be false if types different', () => {
      expect(TypeUtils.is(17, String)).toBeFalsy();
    });
  });

  describe('isString', () => {
    it('Should be true on string', () => {
      expect(TypeUtils.isString('test')).toBeTruthy();
    });

    it('Should be false on not string', () => {
      expect(TypeUtils.isString({})).toBeFalsy();
    });
  });

  describe('isNumber', () => {
    it('Should be true on number', () => {
      expect(TypeUtils.isNumber(7)).toBeTruthy();
    });

    it('Should be true on NaN', () => {
      expect(TypeUtils.isNumber(NaN)).toBeTruthy();
    });

    it('Should be false on not number', () => {
      expect(TypeUtils.isNumber('string')).toBeFalsy();
    });
  });
});
