import {CacheBuilder} from "../../../src/caching/internal";

describe('CacheBuilder', () => {
    describe('setExpirationCheckingPeriod', () => {
        it('Should throw error if period is null or undefined', () => {
            const builder = new CacheBuilder(null);

            expect(() => builder.setExpirationCheckingPeriod(null)).toThrow();
            expect(() => builder.setExpirationCheckingPeriod(undefined)).toThrow();
        });
    });

    describe('setPredefinedValues', () => {
        it('Should throw error if predefinedValues is null or empty', () => {
            const builder = new CacheBuilder(null);

            expect(() => builder.setPredefinedValues(null)).toThrow();
            expect(() => builder.setPredefinedValues(undefined)).toThrow();
            expect(() => builder.setPredefinedValues([])).toThrow();
        });
    });

    describe('setEqualityComparer', () => {
        it('Should throw error if equalityComparer is null or empty', () => {
            const builder = new CacheBuilder(null);

            expect(() => builder.setEqualityComparer(null)).toThrow();
            expect(() => builder.setEqualityComparer(undefined)).toThrow();
        });
    });
});
