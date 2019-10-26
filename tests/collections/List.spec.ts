import {testEnumerable, testReadonlyCollection} from "./common";
import {IList, List} from "../../src/collections/internal";

describe('List', () => {
    testEnumerable(createFromNumberArray);

    testReadonlyCollection(createFromNumberArray);

    describe('add', () => {
        it('Should add value to list', () => {
            const list = new List();

            list.add(10);
            list.add(null);
            list.add(undefined);
            list.add(NaN);

            expect(list.toArray()).toEqual([10, null, undefined, NaN]);
        })
    });

    describe('addRange', () => {
        it('Should throw error when values are null or undefined', () => {
            const list = new List();

            expect(() => list.addRange(null)).toThrow();
            expect(() => list.addRange(undefined)).toThrow();
        });

        it('Should add values to list', () => {
            const list = new List();

            const values = [1, 2, 3, 4, 5];

            list.addRange(values);
            expect(list.length).toBe(values.length);
            expect(list.toArray()).toEqual(values);
        });
    });

    describe('tryRemove', () => {
        it('Should remove item and return true if it exists', () => {
            const list = new List([1]);

            expect(list.tryRemove(1)).toBeTruthy();
            expect(list.toArray()).toEqual([]);
        });

        it('Should return false if item does not exists', () => {
            const list = new List([0, 1, 2, 3]);

            expect(list.tryRemove(15)).toBeFalsy();
            expect(list.length).toBe(4);
        });
    });

    describe('clear', () => {
        it('Should clear list and return elements', () => {
            const referenceElements = [10, 0, 17];
            const list = new List(referenceElements);

            const elements = list.clear();
            expect(elements).toEqual(referenceElements);
            expect(list.length).toBe(0);
            expect(list.toArray()).toEqual([]);
        });
    });
});

function createFromNumberArray(array: number[]): IList<number> {
    return new List(array);
}
