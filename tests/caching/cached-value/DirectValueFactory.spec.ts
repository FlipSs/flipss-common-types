import {DirectValueFactory} from "../../../src/caching/internal";

describe('DirectValueFactory', () => {
    it('Should create value from value factory', () => {
        const value = {
            test: 10
        };

        const valueFactory = new DirectValueFactory(() => value);

        expect(valueFactory.createValue()).toBe(value);
    });
});
