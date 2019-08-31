import {testEnumerable, testReadonlyCollection} from "./common";
import {IEqualityComparer, ISet, Set} from "../../src/collections/internal";

describe('Set', () => {
    testEnumerable(createFromNumberArray);

    testReadonlyCollection(createFromNumberArray);

    describe('has', () => {
        it('Should return true if has value', () => {
            const set = new Set([0, null, undefined, 17]);

            expect(set.has(0)).toBeTruthy();
            expect(set.has(null)).toBeTruthy();
            expect(set.has(undefined)).toBeTruthy();
            expect(set.has(17)).toBeTruthy();
        });

        it('Should return false if has not value', () => {
            const set = new Set([1, 2, 3, 4]);

            expect(set.has(0)).toBeFalsy();
            expect(set.has(null)).toBeFalsy();
            expect(set.has(undefined)).toBeFalsy();
            expect(set.has(17)).toBeFalsy();
        });

        it('Should return true if has value with equality comparer', () => {
            const set = new Set([0, undefined, null, 17], new TestEqualityComparer());

            expect(set.has(0)).toBeTruthy();
            expect(set.has(-123)).toBeTruthy();
            expect(set.has(undefined)).toBeTruthy();
            expect(set.has(null)).toBeTruthy();
            expect(set.has(17)).toBeTruthy();
        });

        it('Should return false if has not value with equality comparer', () => {
            const set = new Set([1, 2, 3, 4], new TestEqualityComparer());

            expect(set.has(5)).toBeFalsy();
            expect(set.has(null)).toBeFalsy();
            expect(set.has(undefined)).toBeFalsy();
            expect(set.has(0)).toBeFalsy();
        });
    });

    describe('intersectWith', () => {
        it('Should remove all items if other collection is empty', () => {
            const set = new Set([1, 2, 3, 4, 5]);
            const other = [];

            set.intersectWith(other);
            expect(set.toArray()).toEqual([]);
        });

        it('Should remove all items that are not in other collection', () => {
            const set = new Set([1, 2, 3, 4, 5]);
            const other = [3, 4, 10];

            set.intersectWith(other);
            expect(set.toArray()).toEqual([3, 4]);
        });

        it('Should remove all items if other collection is empty with equality comparer', () => {
            const set = new Set([1, 2, 3, 4, 5], new TestEqualityComparer());
            const other = [];

            set.intersectWith(other);
            expect(set.toArray()).toEqual([]);
        });

        it('Should remove all items that are not in other collection with equality comparer', () => {
            const set = new Set([0, 1, 2, 3, 4, 5], new TestEqualityComparer());
            const other = [-12, -22, -3, 3, 4, 10];

            set.intersectWith(other);
            expect(set.toArray()).toEqual([0, 3, 4]);
        });
    });

    describe('exceptWith', () => {
        it('Should remove all items that also in other collection', () => {
            const set = new Set([-1, -2, -3, 3]);
            const other = [-2, 3, 1, 4];

            set.exceptWith(other);
            expect(set.toArray()).toEqual([-1, -3]);
        });

        it('Should leave all items if other collection is empty', () => {
            const set = new Set([1, 2, 3]);
            const expected = set.toArray();

            const other = [];
            set.exceptWith(other);

            expect(set.toArray()).toEqual(expected);
        });

        it('Should remove all items that also in other collection with equality comparer', () => {
            const set = new Set([-1, 3, 17], new TestEqualityComparer());
            const other = [-2, -2, -5, 3, 1, 4];

            set.exceptWith(other);
            expect(set.toArray()).toEqual([17]);
        });

        it('Should leave all items if other collection is empty with equality comparer', () => {
            const set = new Set([-1, 0, 1, 2, 3], new TestEqualityComparer());
            const expected = set.toArray();

            const other = [];
            set.exceptWith(other);

            expect(set.toArray()).toEqual(expected);
        });
    });

    describe('tryAdd', () => {
        it('Should add item if it not exists', () => {
            const set = new Set([1, 2, 3]);

            expect(set.tryAdd(4)).toBeTruthy();
            expect(set.contains(4)).toBeTruthy();

            expect(set.tryAdd(null)).toBeTruthy();
            expect(set.contains(null)).toBeTruthy();

            expect(set.tryAdd(undefined)).toBeTruthy();
            expect(set.contains(undefined)).toBeTruthy();
        });

        it('Should add item if it not exists with equality comparer', () => {
            const equalityComparer = new TestEqualityComparer();

            const set = new Set([-1, 2, 3], equalityComparer);

            expect(set.tryAdd(10)).toBeTruthy();
            expect(set.contains(10, equalityComparer)).toBeTruthy();

            expect(set.tryAdd(null)).toBeTruthy();
            expect(set.contains(null, equalityComparer)).toBeTruthy();

            expect(set.tryAdd(undefined)).toBeTruthy();
            expect(set.contains(undefined, equalityComparer)).toBeTruthy();
        });

        it('Should not add item if it exists', () => {
            const set = new Set([1, 2, 3, null, undefined]);

            expect(set.tryAdd(1)).toBeFalsy();
            expect(set.count(v => v === 1)).toBe(1);

            expect(set.tryAdd(null)).toBeFalsy();
            expect(set.count(v => v === null)).toBe(1);

            expect(set.tryAdd(undefined)).toBeFalsy();
            expect(set.count(v => v === undefined)).toBe(1);
        });

        it('Should not add item if it exists with equality comparer', () => {
            const set = new Set([-1, 2, 3, null, undefined], new TestEqualityComparer());

            expect(set.tryAdd(0)).toBeFalsy();
            expect(set.count(v => v === 0)).toBe(0);
            expect(set.count(v => v === -1)).toBe(1);

            expect(set.tryAdd(undefined)).toBeFalsy();
            expect(set.count(v => v === undefined)).toBe(1);

            expect(set.tryAdd(null)).toBeFalsy();
            expect(set.count(v => v === null)).toBe(1);
        });
    });

    describe('tryRemove', () => {
        it('Should remove item if it exists', () => {
            const set = new Set([1, 2, 3]);

            expect(set.tryRemove(1)).toBeTruthy();
            expect(set.contains(1)).toBeFalsy();
        });

        it('Should remove item if it exists with equality comparer', () => {
            const set = new Set([-1, 2, 3], new TestEqualityComparer());

            expect(set.tryRemove(0)).toBeTruthy();
            expect(set.contains(-1)).toBeFalsy();
        });

        it('Should return false if item does not exists', () => {
            const set = new Set([1, 2, 3]);
            const old = set.toArray();

            expect(set.tryRemove(4)).toBeFalsy();
            expect(set.toArray()).toEqual(old);
        });

        it('Should return false if item does not exists with equality comparer', () => {
            const set = new Set([1, 2, 3], new TestEqualityComparer());
            const old = set.toArray();

            expect(set.tryRemove(17)).toBeFalsy();
            expect(set.toArray()).toEqual(old);
        });
    });

    describe('clear', () => {
        it('Should clear set', () => {
            const set = new Set([2, 23, 12]);

            set.clear();
            expect(set.toArray()).toEqual([]);
        });

        it('Should clear set with equality comparer', () => {
            const set = new Set([2, 23, 12], new TestEqualityComparer());

            set.clear();
            expect(set.toArray()).toEqual([]);
        });
    });
});

function createFromNumberArray(array: number[]): ISet<number> {
    return new Set(array);
}

class TestEqualityComparer implements IEqualityComparer<number> {
    public equals(obj1: number, obj2: number): boolean {
        return obj1 === obj2 || (obj1 != undefined && obj2 != undefined && obj1 <= 0 && obj2 <= 0);
    }
}
