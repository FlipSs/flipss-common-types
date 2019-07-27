import {Argument} from "../../../src/utils";

describe('Argument tests', () => {

    describe('isNotNullOrUndefined', () => {
        const parameterName = 'test';

        it('Should throw error on null', () => {
            expect(() => Argument.isNotNullOrUndefined(null, parameterName))
                .toThrow()
        });

        it('Should throw error on undefined', () => {
            expect(() => Argument.isNotNullOrUndefined(undefined, parameterName))
                .toThrow()
        });

        it('Should not throw error on 0', () => {
            expect(() => Argument.isNotNullOrUndefined(0, parameterName))
                .not.toThrow()
        });

        it('Should not throw error on ""', () => {
            expect(() => Argument.isNotNullOrUndefined('', parameterName))
                .not.toThrow()
        });

        it('Should not throw error on {}', () => {
            expect(() => Argument.isNotNullOrUndefined({}, parameterName))
                .not.toThrow()
        });

        it('Should not throw error on obj', () => {
            expect(() => Argument.isNotNullOrUndefined({test: parameterName}, parameterName))
                .not.toThrow()
        });
    });

    describe('isNotNullOrEmpty', () => {
        const parameterName = 'test';

        it('Should throw error on null', () => {
            expect(() => Argument.isNotNullOrEmpty(null, parameterName))
                .toThrow()
        });

        it('Should throw error on undefined', () => {
            expect(() => Argument.isNotNullOrEmpty(undefined, parameterName))
                .toThrow()
        });

        it('Should throw error on ""', () => {
            expect(() => Argument.isNotNullOrEmpty('', parameterName))
                .toThrow()
        });

        it('Should not throw error on string', () => {
            expect(() => Argument.isNotNullOrEmpty(parameterName, parameterName))
                .not.toThrow()
        });
    });
});
