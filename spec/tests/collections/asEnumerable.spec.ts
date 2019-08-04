import {testEnumerable} from "./common";
import {asEnumerable} from "../../../src/collections/internal";

describe('asEnumerable', () => {
    testEnumerable(a => asEnumerable(a));

    it('Should throw error when array is null or undefined', () => {
        expect(() => asEnumerable(undefined)).toThrow();
        expect(() => asEnumerable(null)).toThrow();
    });
});
