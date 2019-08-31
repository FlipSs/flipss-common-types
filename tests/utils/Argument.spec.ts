import {Argument} from "../../src/utils/internal";
import {List} from "../../src/collections/internal";

describe('Argument', () => {

    describe('isNotNullOrUndefined', () => {
        const parameterName = 'test';

        it('Should throw error on null', () => {
            expect(() => Argument.isNotNullOrUndefined(null, parameterName))
                .toThrow();
        });

        it('Should throw error on undefined', () => {
            expect(() => Argument.isNotNullOrUndefined(undefined, parameterName))
                .toThrow();
        });

        it('Should not throw error on 0', () => {
            expect(() => Argument.isNotNullOrUndefined(0, parameterName))
                .not.toThrow();
        });

        it('Should not throw error on empty string', () => {
            expect(() => Argument.isNotNullOrUndefined('', parameterName))
                .not.toThrow();
        });

        it('Should not throw error on empty object', () => {
            expect(() => Argument.isNotNullOrUndefined({}, parameterName))
                .not.toThrow();
        });

        it('Should not throw error on object', () => {
            expect(() => Argument.isNotNullOrUndefined({test: parameterName}, parameterName))
                .not.toThrow();
        });

        it('Should not throw error on function', () => {
            expect(() => Argument.isNotNullOrUndefined(() => 2, parameterName))
                .not.toThrow();
        });

        it('Should not throw error on NaN', () => {
            expect(() => Argument.isNotNullOrUndefined(NaN, parameterName))
                .not.toThrow();
        });
    });

    describe('isNotNullOrEmpty', () => {
        const parameterName = 'test';

        it('Should throw error on null', () => {
            expect(() => Argument.isNotNullOrEmpty(null, parameterName))
                .toThrow();
        });

        it('Should throw error on undefined', () => {
            expect(() => Argument.isNotNullOrEmpty(undefined, parameterName))
                .toThrow();
        });

        it('Should throw error on empty string', () => {
            expect(() => Argument.isNotNullOrEmpty('', parameterName))
                .toThrow();
        });

        it('Should throw error on empty array', () => {
            expect(() => Argument.isNotNullOrEmpty([], parameterName))
                .toThrow();
        });

        it('Should throw error on empty collection', () => {
            expect(() => Argument.isNotNullOrEmpty(new List(), parameterName))
                .toThrow();
        });

        it('Should not throw error on non empty string', () => {
            expect(() => Argument.isNotNullOrEmpty('test', parameterName))
                .not.toThrow();
        });

        it('Should not throw error on non empty array', () => {
            expect(() => Argument.isNotNullOrEmpty([null], parameterName))
                .not.toThrow();
        });

        it('Should not throw error on non empty collection', () => {
            expect(() => Argument.isNotNullOrEmpty(new List([5]), parameterName))
                .not.toThrow();
        });
    });
});
