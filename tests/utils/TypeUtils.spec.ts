import {TypeUtils} from "../../src/utils/internal";

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

        it('Should be false if empty string', () => {
            expect(TypeUtils.isNullOrUndefined('')).toBeFalsy();
        });

        it('Should be false if empty object', () => {
            expect(TypeUtils.isNullOrUndefined({})).toBeFalsy();
        });

        it('Should be false if NaN', () => {
            expect(TypeUtils.isNullOrUndefined(NaN)).toBeFalsy();
        });

        it('Should be false if empty array', () => {
            expect(TypeUtils.isNullOrUndefined([])).toBeFalsy();
        });

        it('Should be false if function', () => {
            expect(TypeUtils.isNullOrUndefined(() => {
            })).toBeFalsy();
        });

        it('Should be false if custom class', () => {
            expect(TypeUtils.isNullOrUndefined(new Test())).toBeFalsy();
        });
    });

    describe('is', () => {
        it('Should be true if [] is Array', () => {
            expect(TypeUtils.is([], Array)).toBeTruthy();
        });

        it('Should be true if new Number(15) is Number', () => {
            // noinspection JSPrimitiveTypeWrapperUsage
            expect(TypeUtils.is(new Number(15), Number)).toBeTruthy();
        });

        it('Should be true if new Number(NaN) is Number', () => {
            // noinspection JSPrimitiveTypeWrapperUsage
            expect(TypeUtils.is(new Number(NaN), Number)).toBeTruthy();
        });

        it('Should be true if new String("") is String', () => {
            // noinspection JSPrimitiveTypeWrapperUsage
            expect(TypeUtils.is(new String(''), String)).toBeTruthy();
        });

        it('Should be true if {} is Object', () => {
            expect(TypeUtils.is({}, Object)).toBeTruthy();
        });

        it('Should be true if () => {} is Function', () => {
            expect(TypeUtils.is(() => {
            }, Function)).toBeTruthy();
        });

        it('Should be true if new Class() is Class', () => {
            expect(TypeUtils.is(new Test(), Test)).toBeTruthy();
        });

        it('Should be true if new Class() is Object', () => {
            expect(TypeUtils.is(new Test(), Object)).toBeTruthy();
        });

        it('Should be true if Class constructor is Function', () => {
            expect(TypeUtils.is(Test, Function)).toBeTruthy();
        });

        it('Should be true if Function is Object', () => {
            expect(TypeUtils.is(() => {
            }, Object)).toBeTruthy();
        });

        it('Should be false if null or undefined is Array', () => {
            expect(TypeUtils.is(null, Array)).toBeFalsy();
            expect(TypeUtils.is(undefined, Array)).toBeFalsy();
        });

        it('Should be false if null or undefined is Object', () => {
            expect(TypeUtils.is(null, Object)).toBeFalsy();
            expect(TypeUtils.is(undefined, Object)).toBeFalsy();
        });

        it('Should be false if null or undefined is String', () => {
            expect(TypeUtils.is(null, String)).toBeFalsy();
            expect(TypeUtils.is(undefined, String)).toBeFalsy();
        });

        it('Should be false if null or undefined is Number', () => {
            expect(TypeUtils.is(null, Number)).toBeFalsy();
            expect(TypeUtils.is(undefined, Number)).toBeFalsy();
        });

        it('Should be false if null or undefined is Function', () => {
            expect(TypeUtils.is(null, Function)).toBeFalsy();
            expect(TypeUtils.is(undefined, Function)).toBeFalsy();
        });

        it('Should be false if null or undefined is custom class', () => {
            expect(TypeUtils.is(null, Test)).toBeFalsy();
            expect(TypeUtils.is(undefined, Test)).toBeFalsy();
        });

        it('Should be false if Number is String', () => {
            expect(TypeUtils.is(123, String)).toBeFalsy();
            // noinspection JSPrimitiveTypeWrapperUsage
            expect(TypeUtils.is(new Number(213), String)).toBeFalsy();
        });

        it('Should be false if String is Number', () => {
            expect(TypeUtils.is('123', Number)).toBeFalsy();
            // noinspection JSPrimitiveTypeWrapperUsage
            expect(TypeUtils.is(new String(213), Number)).toBeFalsy();
        });

        it('Should be false if Object is Function', () => {
            expect(TypeUtils.is({}, Function)).toBeFalsy();
        });

        it('Should be false if Arrays of type is type', () => {
            expect(TypeUtils.is([new Test()], Test)).toBeFalsy();
        });
    });

    describe('isString', () => {
        it('Should be true on string', () => {
            expect(TypeUtils.isString('test')).toBeTruthy();

            // noinspection JSPrimitiveTypeWrapperUsage
            expect(TypeUtils.isString(new String('string'))).toBeTruthy();
        });

        it('Should be false on object', () => {
            expect(TypeUtils.isString({})).toBeFalsy();
        });

        it('Should be false on number', () => {
            expect(TypeUtils.isString(123)).toBeFalsy();
        });

        it('Should be false on function', () => {
            expect(TypeUtils.isString(() => 'test')).toBeFalsy();
        });

        it('Should be false on array of strings', () => {
            expect(TypeUtils.isString(['test1'])).toBeFalsy();
        });

        it('Should be false on null or undefined', () => {
            expect(TypeUtils.isString(null)).toBeFalsy();
            expect(TypeUtils.isString(undefined)).toBeFalsy();
        });
    });

    describe('isFunction', () => {
        it('Should be true on function', () => {
            expect(TypeUtils.isFunction(function () {
            })).toBeTruthy();

            expect(TypeUtils.isFunction(() => {
            })).toBeTruthy();

            expect(new Function()).toBeTruthy();
        });

        it('Should be false on object', () => {
            expect(TypeUtils.isFunction({})).toBeFalsy();
        });

        it('Should be false on number', () => {
            expect(TypeUtils.isFunction(123)).toBeFalsy();
        });

        it('Should be false on array of strings', () => {
            expect(TypeUtils.isFunction(['test1'])).toBeFalsy();
        });

        it('Should be false on null or undefined', () => {
            expect(TypeUtils.isFunction(null)).toBeFalsy();
            expect(TypeUtils.isFunction(undefined)).toBeFalsy();
        });
    });

    describe('isNumber', () => {
        it('Should be true on number', () => {
            expect(TypeUtils.isNumber(7)).toBeTruthy();

            // noinspection JSPrimitiveTypeWrapperUsage
            expect(TypeUtils.isNumber(new Number((17)))).toBeTruthy();
        });

        it('Should be false on NaN', () => {
            expect(TypeUtils.isNumber(NaN)).toBeFalsy();
        });

        it('Should be false on object', () => {
            expect(TypeUtils.isNumber({})).toBeFalsy();
        });

        it('Should be false on string', () => {
            expect(TypeUtils.isNumber('string')).toBeFalsy();
        });

        it('Should be false on function', () => {
            expect(TypeUtils.isNumber(() => 231)).toBeFalsy();
        });

        it('Should be false on array of numbers', () => {
            expect(TypeUtils.isNumber([213, 213])).toBeFalsy();
        });

        it('Should be false on null or undefined', () => {
            expect(TypeUtils.isNumber(null)).toBeFalsy();
            expect(TypeUtils.isNumber(undefined)).toBeFalsy();
        });
    });
});

class Test {
}
