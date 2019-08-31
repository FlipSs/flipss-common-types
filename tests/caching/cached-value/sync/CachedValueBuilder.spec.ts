import {CachedValueBuilder} from "../../../../src/caching/internal";

describe('CachedValueBuilder', () => {
    describe('saveValueToValueStorage', () => {
        it('Should throw error when valueStorage is null or undefined', () => {
            const builder = new CachedValueBuilder(null, null);

            expect(() => builder.saveValueToValueStorage(null)).toThrow();
            expect(() => builder.saveValueToValueStorage(undefined)).toThrow();
        });
    });

    describe('useValueStorageOnFailure', () => {
        it('Should throw error when valueStorage is null or undefined', () => {
            const builder = new CachedValueBuilder(null, null);

            expect(() => builder.useValueStorageOnFailure(null)).toThrow();
            expect(() => builder.useValueStorageOnFailure(undefined)).toThrow();
        });
    });

    describe('useValueStorageOnInit', () => {
        it('Should throw error when valueStorage is null or undefined', () => {
            const builder = new CachedValueBuilder(null, null);

            expect(() => builder.useValueStorageOnInit(null)).toThrow();
            expect(() => builder.useValueStorageOnInit(undefined)).toThrow();
        });
    });
});
