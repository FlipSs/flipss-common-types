import {PropertyNotAvailableError} from "../../src/converters/internal";
import {Set} from "../../src/collections/Set";

describe('PropertyNotAvailableError', () => {
    it('Should throw error when propertyNames is null or undefined or empty', () => {
        expect(() => new PropertyNotAvailableError(null)).toThrow();
        expect(() => new PropertyNotAvailableError(undefined)).toThrow();
        expect(() => new PropertyNotAvailableError(new Set())).toThrow();
    });

    it('Should set PropertyNotAvailableError prototype', () => {
        const error = new PropertyNotAvailableError(new Set(['test']));

        expect(error instanceof PropertyNotAvailableError).toBeTruthy();
    });

    it('Should return propertyNames', () => {
        const propertyNames = new Set(['test']);
        const error = new PropertyNotAvailableError(propertyNames);

        expect(error.notAvailablePropertyNames).toBe(propertyNames);
    });
});
