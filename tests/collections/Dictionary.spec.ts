import {testEnumerableGeneric, testReadonlyCollection} from "./common";
import {Dictionary} from "../../src/collections/Dictionary";
import {IDictionary} from "../../src/collections/IDictionary";
import {IEqualityComparer} from "../../src/collections/IEqualityComparer";

describe('Dictionary', () => {
    testEnumerableGeneric(createFromNumberArray, v => v.value, {
        key: 15,
        value: 0
    });

    testReadonlyCollection(createFromNumberArray);

    describe('values', () => {
        it('Should return all values', () => {
            const values = [1, 2, 3, 4, 5];
            const dictionary = new Dictionary<number, number>(values.map(v => {
                return {
                    key: v * 2,
                    value: v
                };
            }));

            expect(dictionary.values).toEqual(values);
        });

        it('Should return all values with equality comparer', () => {
            const values = [1, 2, 3, 4, 5];
            const dictionary = new Dictionary<number, number>(values.map(v => {
                return {
                    key: v + 1,
                    value: v
                };
            }), new TestEqualityComparer());

            expect(dictionary.values).toEqual([2, 4, 5]);
        });
    });

    describe('keys', () => {
        it('Should return all keys', () => {
            const keys = [1, 2, 3, 4, 5];
            const dictionary = new Dictionary<number, number>(keys.map(v => {
                return {
                    key: v,
                    value: v + 1
                };
            }));

            expect(dictionary.keys).toEqual(keys);
        });

        it('Should return all keys with equality comparer', () => {
            const keys = [1, 2, 3, 4, 5];
            const dictionary = new Dictionary<number, number>(keys.map(v => {
                return {
                    key: v,
                    value: v * 2
                };
            }), new TestEqualityComparer());

            expect(dictionary.keys).toEqual([1, 3, 5]);
        });
    });

    describe('containsKey', () => {
        it('Should return true if key exists', () => {
            const dictionary = new Dictionary<number, number>([{
                key: 12,
                value: 0
            }]);

            expect(dictionary.containsKey(12)).toBeTruthy();
        });

        it('Should return true if key exists with equality comparer', () => {
            const dictionary = new Dictionary<number, number>([{
                key: 1,
                value: 0
            }], new TestEqualityComparer());

            expect(dictionary.containsKey(2)).toBeTruthy();
        });

        it('Should return false if key does not exists', () => {
            const dictionary = new Dictionary<number, number>([{
                key: -1,
                value: 0
            }]);

            expect(dictionary.containsKey(0)).toBeFalsy();
        });

        it('Should return false if key does not exists with equality comparer', () => {
            const dictionary = new Dictionary<number, number>([{
                key: -1,
                value: 0
            }], new TestEqualityComparer());

            expect(dictionary.containsKey(1)).toBeFalsy();
        });

        it('Should return true work for null and undefined keys if exists', () => {
            const dictionaryWithNullAndUndefinedKeys = new Dictionary<number, number>([{
                key: undefined,
                value: null
            }, {
                key: null,
                value: undefined
            }]);

            expect(dictionaryWithNullAndUndefinedKeys.containsKey(null)).toBeTruthy();
            expect(dictionaryWithNullAndUndefinedKeys.containsKey(undefined)).toBeTruthy();
        });

        it('Should return false work for null and undefined keys if not exists', () => {
            const emptyDictionary = new Dictionary(undefined);

            expect(emptyDictionary.containsKey(null)).toBeFalsy();
            expect(emptyDictionary.containsKey(undefined)).toBeFalsy();
        });

        it('Should return true work for null and undefined keys if exists with equality comparer', () => {
            const dictionaryWithNullAndUndefinedKeys = new Dictionary<number, number>([{
                key: undefined,
                value: 0
            }, {
                key: null,
                value: undefined
            }], new TestEqualityComparer());

            expect(dictionaryWithNullAndUndefinedKeys.containsKey(null)).toBeTruthy();
            expect(dictionaryWithNullAndUndefinedKeys.containsKey(undefined)).toBeTruthy();
        });

        it('Should return false work for null and undefined keys if not exists with equality comparer', () => {
            const emptyDictionary = new Dictionary(undefined, new TestEqualityComparer());

            expect(emptyDictionary.containsKey(null)).toBeFalsy();
            expect(emptyDictionary.containsKey(undefined)).toBeFalsy();
        });
    });

    describe('getOrDefault', () => {
        it('Should return default value if key does not exists', () => {
            const dictionary = new Dictionary();

            expect(dictionary.getOrDefault(0, 17)).toEqual(17);
        });

        it('Should return default value if key does not exists with equality comparer', () => {
            const dictionary = new Dictionary(undefined, new TestEqualityComparer());

            expect(dictionary.getOrDefault(0, 17)).toEqual(17);
        });

        it('Should return value if key exists', () => {
            const dictionary = new Dictionary([{
                key: 15,
                value: 0
            }]);

            expect(dictionary.getOrDefault(15)).toEqual(0);
        });

        it('Should return value if key exists with equality comparer', () => {
            const dictionary = new Dictionary([{
                key: 17,
                value: 0
            }], new TestEqualityComparer());

            expect(dictionary.getOrDefault(16)).toEqual(0);
        });
    });

    describe('get', () => {
        it('Should throw error if key does not exists', () => {
            const dictionary = new Dictionary();

            expect(() => dictionary.get(0)).toThrow();
        });

        it('Should throw error if key does not exists with equality comparer', () => {
            const dictionary = new Dictionary(undefined, new TestEqualityComparer());

            expect(() => dictionary.get(0)).toThrow();
        });

        it('Should return value if key exists', () => {
            const dictionary = new Dictionary([{
                key: 15,
                value: 0
            }]);

            expect(dictionary.get(15)).toEqual(0);
        });

        it('Should return value if key exists with equality comparer', () => {
            const dictionary = new Dictionary([{
                key: 17,
                value: 0
            }], new TestEqualityComparer());

            expect(dictionary.get(18)).toEqual(0);
        });
    });

    describe('tryRemove', () => {
        it('Should return false if key does not exists', () => {
            const dictionary = new Dictionary<number, number>();

            expect(dictionary.tryRemove(10)).toBeFalsy();
        });

        it('Should return true if key exists', () => {
            const dictionary = new Dictionary<number, number>([
                {
                    key: 0,
                    value: 0
                }
            ]);

            expect(dictionary.tryRemove(0)).toBeTruthy();
            expect(dictionary.toArray()).toEqual([]);
        });

        it('Should return false if key does not exists with equality comparer', () => {
            const dictionary = new Dictionary<number, number>(undefined, new TestEqualityComparer());

            expect(dictionary.tryRemove(10)).toBeFalsy();
        });

        it('Should return true if key exists with equality comparer', () => {
            const dictionary = new Dictionary<number, number>([
                {
                    key: 0,
                    value: 0
                }
            ], new TestEqualityComparer());

            expect(dictionary.tryRemove(-1)).toBeTruthy();
            expect(dictionary.toArray()).toEqual([]);
        });
    });

    describe('tryAdd', () => {
        it('Should return true if key does not exists', () => {
            const dictionary = new Dictionary<number, number>();

            expect(dictionary.tryAdd(0, 0)).toBeTruthy();
            expect(dictionary.toArray()).toEqual([{
                key: 0,
                value: 0
            }]);
        });

        it('Should return true if key does not exists with equality comparer', () => {
            const dictionary = new Dictionary<number, number>([
                {
                    key: 0,
                    value: 0
                }
            ]);

            expect(dictionary.tryAdd(2, 0)).toBeTruthy();
            expect(dictionary.toArray()).toEqual([{
                key: 0,
                value: 0
            }, {
                key: 2,
                value: 0
            }]);
        });

        it('Should return false if key exists', () => {
            const dictionary = new Dictionary<number, number>([
                {
                    key: 0,
                    value: 0
                }
            ]);

            expect(dictionary.tryAdd(0, 1)).toBeFalsy();
            expect(dictionary.toArray()).toEqual([{
                key: 0,
                value: 0
            }]);
        });

        it('Should return false if key exists with equality comparer', () => {
            const dictionary = new Dictionary<number, number>([
                {
                    key: 0,
                    value: 0
                }
            ], new TestEqualityComparer());

            expect(dictionary.tryAdd(1, 1)).toBeFalsy();
            expect(dictionary.toArray()).toEqual([{
                key: 0,
                value: 0
            }]);
        });
    });

    describe('set', () => {
        it('Should override value if key exists', () => {
            const dictionary = new Dictionary<number, number>([
                {
                    key: 0,
                    value: 0
                }
            ]);

            dictionary.set(0, 10);

            expect(dictionary.toArray()).toEqual([{
                key: 0,
                value: 10
            }]);
        });

        it('Should overwrite value if key exists with equality comparer', () => {
            const dictionary = new Dictionary<number, number>([
                {
                    key: 0,
                    value: 0
                }
            ], new TestEqualityComparer());

            dictionary.set(1, 10);

            expect(dictionary.toArray()).toEqual([{
                key: 0,
                value: 10
            }]);
        });

        it('Should add value if key does not exists', () => {
            const dictionary = new Dictionary<number, number>();

            dictionary.set(0, 0);
            expect(dictionary.toArray()).toEqual([{
                key: 0,
                value: 0
            }]);
        });

        it('Should add value if key does not exists with equality comparer', () => {
            const dictionary = new Dictionary<number, number>([{
                key: 0,
                value: 2
            }], new TestEqualityComparer());

            dictionary.set(3, 4);
            expect(dictionary.toArray()).toEqual([{
                key: 0,
                value: 2
            }, {
                key: 3,
                value: 4
            }]);
        });
    });

    describe('getOrAdd', () => {
        it('Should return existing value and not call value factory if key exists', () => {
            const dictionary = new Dictionary<number, number>([{
                key: 0,
                value: 0
            }]);

            let isCalled = false;
            expect(dictionary.getOrAdd(0, () => {
                isCalled = true;

                return 4;
            })).toBe(0);

            expect(isCalled).toBeFalsy();
        });

        it('Should return existing value and not call value factory if key exists with equality comparer', () => {
            const dictionary = new Dictionary<number, number>([{
                key: 0,
                value: 0
            }], new TestEqualityComparer());

            let isCalled = false;
            expect(dictionary.getOrAdd(1, () => {
                isCalled = true;

                return 5;
            })).toBe(0);

            expect(isCalled).toBeFalsy();
        });

        it('Should add value if key does not exists', () => {
            const dictionary = new Dictionary<number, number>();

            expect(dictionary.getOrAdd(1, k => k * 2)).toBe(2);
            expect(dictionary.toArray()).toEqual([{
                key: 1,
                value: 2
            }]);
        });

        it('Should add value if key does not exists with equality comparer', () => {
            const dictionary = new Dictionary<number, number>([
                {
                    key: 0,
                    value: 1
                }
            ], new TestEqualityComparer());

            expect(dictionary.getOrAdd(2, k => k * 5)).toBe(10);
            expect(dictionary.toArray()).toEqual([{
                key: 0,
                value: 1
            }, {
                key: 2,
                value: 10
            }]);
        });
    });

    describe('clear', () => {
        it('Should clear dictionary', () => {
            const dictionary = new Dictionary([
                {
                    key: 0,
                    value: 0
                },
                {
                    key: 1,
                    value: -1
                }
            ]);

            dictionary.clear();

            expect(dictionary.toArray()).toEqual([]);
        });

        it('Should clear dictionary with equality comparer', () => {
            const dictionary = new Dictionary([
                {
                    key: 0,
                    value: 0
                },
                {
                    key: 1,
                    value: -1
                }
            ], new TestEqualityComparer());

            dictionary.clear();

            expect(dictionary.toArray()).toEqual([]);
        });
    });
});

function createFromNumberArray(array: number[]): IDictionary<number, number> {
    return new Dictionary(array.map(i => {
        return {
            key: i,
            value: i
        };
    }));
}

class TestEqualityComparer implements IEqualityComparer<number> {
    public equals(obj1: number, obj2: number): boolean {
        return obj1 === obj2 || (obj1 != undefined && obj2 != undefined && Math.abs(obj1 - obj2) <= 1);
    }
}
