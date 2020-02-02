import {testEnumerable} from "./common";
import {asEnumerable, funcAsEnumerable} from "../../src/collections/internal";

describe('asEnumerable', () => {
    testEnumerable(a => asEnumerable(a));
    testEnumerable(a => funcAsEnumerable(() => generator(a)));

    it('Should throw error when array is null or undefined', () => {
        expect(() => asEnumerable(undefined)).toThrow();
        expect(() => asEnumerable(null)).toThrow();
    });
});

function* generator(values: number[]): Iterator<number> {
    for (const value of values) {
        yield value;
    }
}

