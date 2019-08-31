import {ConstantPropertyValueFactory} from "../../src/converters/internal";

describe('ConstantPropertyValueFactory', () => {
    it('Should return value passed in constructor', () => {
        const value = {
            test: 12
        };

        const valueFactory = new ConstantPropertyValueFactory<any, any>(value);

        expect(valueFactory.create(null)).toBe(value);
        expect(valueFactory.create(undefined)).toBe(value);
        expect(valueFactory.create({})).toBe(value);
        expect(valueFactory.create([])).toBe(value);
    });
});
