import {
    Dictionary,
    IComparer,
    IEnumerable,
    IEqualityComparer,
    IKeyValuePair,
    IReadOnlyCollection,
    List,
    Set as MySet
} from "../../src/collections/internal";
import {Action, Func} from "../../src/types/internal";
import {TypeUtils} from "../../src/utils/TypeUtils";
/*import {performance} from 'perf_hooks';

const smallArrayLength = 10;*/

const normalArrayLength = 100;

/*const bigArrayLength = 1000;
const hugeArrayLength = 10000;*/

export function testEnumerable(enumerableFactory: Func<IEnumerable<number>, number[]>) {
    return testEnumerableGeneric(enumerableFactory, v => v, 17);
}

export function testReadonlyCollection<T>(collectionFactory: Func<IReadOnlyCollection<T>, number[]>): void {
    describe('length', () => {
        it('Should return actual length', () => {
            const expectedLength = Math.floor(Math.random() * normalArrayLength);
            const source = createArray(expectedLength);
            const collection = collectionFactory(source);

            expect(collection.length).toEqual(expectedLength);
        });
    });

    describe('isEmpty', () => {
        it('Should be true when no items', () => {
            const collection = collectionFactory([]);

            expect(collection.isEmpty).toBeTruthy();
        });

        it('Should be false if not empty', () => {
            const collection = collectionFactory(createArray(normalArrayLength));

            expect(collection.isEmpty).toBeFalsy();
        })
    });
}

export function testEnumerableGeneric<T>(enumerableFactory: Func<IEnumerable<T>, number[]>, valueProvider: Func<number, T>, defaultValue: T): void {
    describe('Iterator', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should iterate through collection',
                    action: (array, enumerable) => {
                        for (const item of enumerable) {
                            expect(valueProvider(item)).toBe(array.shift());
                        }
                    }
                }
            ]
        );
    });

    describe('getElementAt', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should return element when it exists',
                    action: (array, enumerable) => {
                        const index = getRandomIndex(array.length);

                        expect(valueProvider(enumerable.getElementAt(index))).toBe(array[index]);
                    }
                },
                {
                    name: 'Should throw error when index less than zero',
                    action: (array, enumerable) => {
                        expect(() => enumerable.getElementAt(-1)).toThrow();
                    }
                },
                {
                    name: 'Should throw error when index greater than or equal length',
                    action: (array, enumerable) => {
                        expect(() => enumerable.getElementAt(array.length)).toThrow();
                        expect(() => enumerable.getElementAt(array.length + 1)).toThrow();
                    }
                }
            ]
        );
    });

    describe('getElementAtOrDefault', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should return element when it exists',
                    action: (array, enumerable) => {
                        const index = getRandomIndex(array.length);

                        expect(valueProvider(enumerable.getElementAtOrDefault(index))).toBe(array[index]);
                    }
                },
                {
                    name: 'Should return default when index less than zero',
                    action: (array, enumerable) => {
                        expect(enumerable.getElementAtOrDefault(-1, defaultValue)).toBe(defaultValue);
                    }
                },
                {
                    name: 'Should return default when index greater than or equal length',
                    action: (array, enumerable) => {
                        expect(enumerable.getElementAtOrDefault(array.length, defaultValue)).toBe(defaultValue);
                        expect(enumerable.getElementAtOrDefault(array.length + 1, defaultValue)).toBe(defaultValue);
                    }
                },
                {
                    name: 'Should return undefined when item not exists and default value not provided',
                    action: (array, enumerable) => {
                        expect(enumerable.getElementAtOrDefault(array.length * 2)).toBeUndefined();
                    }
                }
            ]
        );
    });

    describe('count', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should return element count when predicate not provided',
                    action: (array, enumerable) => {
                        expect(enumerable.count()).toBe(array.length);
                    }
                },
                {
                    name: 'Should return right count when predicate provided',
                    action: (array, enumerable) => {
                        expect(enumerable.count(i => valueProvider(i) >= 0)).toBe(array.filter(i => i >= 0).length);
                    }
                }
            ]
        );
    });

    describe('any', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should return true if not empty',
                    action: (array, enumerable) => {
                        expect(enumerable.any()).toBeTruthy();
                    }
                },
                {
                    name: 'Should return true if at least 1 item match predicate',
                    action: () => {
                        const enumerable = enumerableFactory([0, 1, 2, 3, 4, 5]);

                        expect(enumerable.any(i => valueProvider(i) === 0)).toBeTruthy();
                    }
                },
                {
                    name: 'Should return false if empty',
                    action: () => {
                        expect(enumerableFactory([]).any()).toBeFalsy();
                    }
                },
                {
                    name: 'Should return false if no one element match predicate',
                    action: (array, enumerable) => {
                        expect(enumerable.any(i => i === undefined)).toBeFalsy();
                    }
                }
            ]
        );
    });

    describe('all', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should return true if all elements match predicate',
                    action: (array, enumerable) => {
                        expect(enumerable.all(() => true)).toBeTruthy();
                    }
                },
                {
                    name: 'Should return false if at least 1 item does not match predicate',
                    action: () => {
                        const enumerable = enumerableFactory([0, 1, 2, 3, 4, 5]);

                        expect(enumerable.all(i => valueProvider(i) > 0)).toBeFalsy();
                    }
                },
                {
                    name: 'Should throw error if predicate is null or undefined',
                    action: (array, enumerable) => {
                        expect(() => enumerable.all(null)).toThrow();
                        expect(() => enumerable.all(undefined)).toThrow();
                    }
                }
            ]
        );
    });

    describe('getFirst', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should return first element if predicate is not specified',
                    action: (array, enumerable) => {
                        expect(valueProvider(enumerable.getFirst())).toBe(array[0]);
                    }
                },
                {
                    name: 'Should throw error if empty',
                    action: () => {
                        expect(() => enumerableFactory([]).getFirst()).toThrow();
                    }
                },
                {
                    name: 'Should throw error if no one element match predicate',
                    action: (array, enumerable) => {
                        expect(() => enumerable.getFirst(() => false)).toThrow();
                    }
                },
                {
                    name: 'Should return first element that match predicate',
                    action: () => {
                        const enumerable = enumerableFactory([1, 2, 4, 5, 0, 21, 2]);

                        expect(valueProvider(enumerable.getFirst(i => valueProvider(i) <= 0))).toBe(0);
                    }
                }
            ]
        );
    });

    describe('getLast', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should return last element if predicate is not specified',
                    action: (array, enumerable) => {
                        expect(valueProvider(enumerable.getLast())).toBe(array[array.length - 1]);
                    }
                },
                {
                    name: 'Should throw error if empty',
                    action: () => {
                        expect(() => enumerableFactory([]).getLast()).toThrow();
                    }
                },
                {
                    name: 'Should throw error if no one element match predicate',
                    action: (array, enumerable) => {
                        expect(() => enumerable.getLast(() => false)).toThrow();
                    }
                },
                {
                    name: 'Should return last element that match predicate',
                    action: () => {
                        const enumerable = enumerableFactory([1, 2, 123, 0, 3, -1]);

                        expect(valueProvider(enumerable.getLast(i => valueProvider(i) > 0))).toBe(3);
                    }
                }
            ]
        );
    });

    describe('distinct', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should return only different elements',
                    action: (array, enumerable) => {
                        const expectedItems = [];
                        for (const item of array) {
                            if (!expectedItems.includes(item)) {
                                expectedItems.push(item);
                            }
                        }

                        expect(enumerable.distinct().toArray().map(i => valueProvider(i))).toEqual(expectedItems);
                    }
                },
                {
                    name: 'Should return only different items depending on comparer',
                    action: (array, enumerable) => {
                        const expectedItems = [];
                        const comparer = new TestNumberEqualityComparer();
                        for (const item of array) {
                            if (!expectedItems.some(i => comparer.equals(item, i))) {
                                expectedItems.push(item);
                            }
                        }

                        expect(enumerable.distinct(new TestEqualityComparer(valueProvider)).toArray().map(i => valueProvider(i))).toEqual(expectedItems);
                    }
                },
                {
                    name: 'Should not throw if empty',
                    action: () => {
                        expect(() => enumerableFactory([]).distinct().toArray()).not.toThrow();
                    }
                }
            ]
        );
    });

    describe('defaultIfEmpty', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should return default item if empty',
                    action: () => {
                        expect(enumerableFactory([]).defaultIfEmpty(defaultValue).toArray()).toEqual([defaultValue]);
                    }
                },
                {
                    name: 'Should not change items if not empty',
                    action: (array, enumerable) => {
                        expect(enumerable.defaultIfEmpty(defaultValue).toArray().map(i => valueProvider(i))).toEqual(array);
                    }
                }
            ]
        );
    });

    describe('getLastOrDefault', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should return last element if predicate is not specified',
                    action: (array, enumerable) => {
                        expect(valueProvider(enumerable.getLastOrDefault())).toBe(array[array.length - 1]);
                    }
                },
                {
                    name: 'Should return defaultValue if empty',
                    action: () => {
                        expect(enumerableFactory([]).getLastOrDefault()).toBeUndefined();
                    }
                },
                {
                    name: 'Should return defaultValue if no one element match predicate',
                    action: (array, enumerable) => {
                        expect(enumerable.getLastOrDefault(() => false, defaultValue)).toBe(defaultValue);
                    }
                },
                {
                    name: 'Should return last element that match predicate',
                    action: () => {
                        const enumerable = enumerableFactory([-3, 2, -1, 0, 3, -1]);

                        expect(valueProvider(enumerable.getLastOrDefault(i => valueProvider(i) < 0))).toBe(-1);
                    }
                }
            ]
        );
    });

    describe('getFirstOrDefault', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should return first element if predicate is not specified',
                    action: (array, enumerable) => {
                        expect(valueProvider(enumerable.getFirstOrDefault())).toBe(array[0]);
                    }
                },
                {
                    name: 'Should return defaultValue if empty',
                    action: () => {
                        expect(enumerableFactory([]).getFirstOrDefault()).toBeUndefined();
                    }
                },
                {
                    name: 'Should return defaultValue if no one element match predicate',
                    action: (array, enumerable) => {
                        expect(enumerable.getFirstOrDefault(() => false, defaultValue)).toBe(defaultValue);
                    }
                },
                {
                    name: 'Should return first element that match predicate',
                    action: () => {
                        const enumerable = enumerableFactory([1, 2, -1, 213, -2]);

                        expect(valueProvider(enumerable.getFirstOrDefault(i => valueProvider(i) < 0))).toBe(-1);
                    }
                }
            ]
        );
    });

    describe('where', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should throw error when predicate is null or undefined',
                    action: (array, enumerable) => {
                        expect(() => enumerable.where(null)).toThrow();
                        expect(() => enumerable.where(undefined)).toThrow();
                    }
                },
                {
                    name: 'Should filter all elements that not match predicate',
                    action: (array, enumerable) => {
                        expect(enumerable.where(i => valueProvider(i) > 0).toArray().map(i => valueProvider(i))).toEqual(array.filter(i => i > 0));
                    }
                }
            ]
        );
    });

    describe('select', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should throw error when selector is null or undefined',
                    action: (array, enumerable) => {
                        expect(() => enumerable.select(null)).toThrow();
                        expect(() => enumerable.select(undefined)).toThrow();
                    }
                },
                {
                    name: 'Should select element part according to selector',
                    action: (array, enumerable) => {
                        expect(enumerable.select(i => valueProvider(i) + 1).toArray()).toEqual(array.map(i => i + 1));
                    }
                }
            ]
        );
    });

    describe('selectMany', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should throw error when selector is null or undefined',
                    action: (array, enumerable) => {
                        expect(() => enumerable.selectMany(null)).toThrow();
                        expect(() => enumerable.selectMany(undefined)).toThrow();
                    }
                },
                {
                    name: 'Should concat selected elements into one array',
                    action: (array, enumerable) => {
                        const expectedResult = [];
                        array.forEach(i => expectedResult.push(i, 0));

                        expect(enumerable.selectMany(i => [valueProvider(i), 0]).toArray()).toEqual(expectedResult);
                    }
                }
            ]
        );
    });

    describe('concat', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should throw error when other is null or undefined',
                    action: (array, enumerable) => {
                        expect(() => enumerable.concat(null)).toThrow();
                        expect(() => enumerable.concat(undefined)).toThrow();
                    }
                },
                {
                    name: 'Should concat two collections',
                    action: (array, enumerable) => {
                        expect(enumerable.concat(enumerable).toArray().map(i => valueProvider(i))).toEqual([...array, ...array]);
                    }
                }
            ]
        );
    });

    describe('contains', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should find equal items by default',
                    action: () => {
                        const enumerable = enumerableFactory([0, 1, 2]);

                        expect(enumerable.select(i => valueProvider(i)).contains(3)).toBeFalsy();
                        expect(enumerable.select(i => valueProvider(i)).contains(0)).toBeTruthy();
                    }
                },
                {
                    name: 'Should find item according to comparer',
                    action: () => {
                        expect(enumerableFactory([-1]).select(i => valueProvider(i)).contains(1, new TestNumberEqualityComparer())).toBeFalsy();
                        expect(enumerableFactory([213]).select(i => valueProvider(i)).contains(1, new TestNumberEqualityComparer())).toBeTruthy();
                    }
                }
            ]
        );
    });

    describe('reverse', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should return reversed items',
                    action: (array, enumerable) => {
                        expect(enumerable.reverse().select(i => valueProvider(i)).toArray()).toEqual(array.reverse());
                    }
                },
                {
                    name: 'Should not throw error if empty',
                    action: () => {
                        expect(() => enumerableFactory([]).reverse().toArray()).not.toThrow();
                    }
                }
            ]
        );
    });

    describe('append', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should add value to the ending of collection',
                    action: (array, enumerable) => {
                        expect(enumerable.where(i => i !== defaultValue).append(defaultValue).getLast()).toEqual(defaultValue);
                    }
                },
                {
                    name: 'Should add value to the ending of collection even if it null or undefined',
                    action: (array, enumerable) => {
                        expect(enumerable.where(i => i !== null).append(null).getLast()).toBeNull();
                        expect(enumerable.where(i => i !== undefined).append(undefined).getLast()).toBeUndefined();
                    }
                }
            ]
        );
    });

    describe('prepend', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should add value to the beginning of collection',
                    action: (array, enumerable) => {
                        expect(enumerable.where(i => i !== defaultValue).prepend(defaultValue).getFirst()).toEqual(defaultValue);
                    }
                },
                {
                    name: 'Should add value to the beginning of collection even if it null or undefined',
                    action: (array, enumerable) => {
                        expect(enumerable.where(i => i !== null).prepend(null).getFirst()).toBeNull();
                        expect(enumerable.where(i => i !== undefined).prepend(undefined).getFirst()).toBeUndefined();
                    }
                }
            ]
        );
    });

    describe('max', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should throw error when value provider is null or undefined',
                    action: (array, enumerable) => {
                        expect(() => enumerable.max(undefined)).toThrow();
                        expect(() => enumerable.max(null)).toThrow();
                    }
                },
                {
                    name: 'Should throw error when empty',
                    action: () => {
                        expect(() => enumerableFactory([]).max(valueProvider)).toThrow();
                    }
                },
                {
                    name: 'Should find max value according to value provider',
                    action: (array, enumerable) => {
                        let max = array[0];
                        for (let i = 1; i < array.length; i++) {
                            if (array[i] > max) {
                                max = array[i];
                            }
                        }

                        expect(enumerable.max(valueProvider)).toEqual(max);
                    }
                }
            ]
        );
    });

    describe('min', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should throw error when value provider is null or undefined',
                    action: (array, enumerable) => {
                        expect(() => enumerable.min(undefined)).toThrow();
                        expect(() => enumerable.min(null)).toThrow();
                    }
                },
                {
                    name: 'Should throw error when empty',
                    action: () => {
                        expect(() => enumerableFactory([]).min(valueProvider)).toThrow();
                    }
                },
                {
                    name: 'Should find min value according to value provider',
                    action: (array, enumerable) => {
                        let min = array[0];
                        for (let i = 1; i < array.length; i++) {
                            if (array[i] < min) {
                                min = array[i];
                            }
                        }

                        expect(enumerable.min(valueProvider)).toEqual(min);
                    }
                }
            ]
        );
    });

    describe('sum', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should throw error when value provider is null or undefined',
                    action: (array, enumerable) => {
                        expect(() => enumerable.sum(undefined)).toThrow();
                        expect(() => enumerable.sum(null)).toThrow();
                    }
                },
                {
                    name: 'Should throw error when empty',
                    action: () => {
                        expect(() => enumerableFactory([]).sum(valueProvider)).toThrow();
                    }
                },
                {
                    name: 'Should calculate sum according to value provider',
                    action: (array, enumerable) => {
                        let sum = 0;
                        for (const item of array) {
                            sum += item;
                        }

                        expect(enumerable.sum(valueProvider)).toEqual(sum);
                    }
                }
            ]
        );
    });

    describe('average', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should throw error when value provider is null or undefined',
                    action: (array, enumerable) => {
                        expect(() => enumerable.average(undefined)).toThrow();
                        expect(() => enumerable.average(null)).toThrow();
                    }
                },
                {
                    name: 'Should throw error when empty',
                    action: () => {
                        expect(() => enumerableFactory([]).average(valueProvider)).toThrow();
                    }
                },
                {
                    name: 'Should calculate average value according to value provider',
                    action: (array, enumerable) => {
                        let sum = 0;
                        for (const item of array) {
                            sum += item;
                        }

                        expect(enumerable.average(valueProvider)).toEqual(sum / array.length);
                    }
                }
            ]
        );
    });

    describe('take', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should take all collection if length less than items to take',
                    action: (array, enumerable) => {
                        expect(enumerable.take(array.length * 2).toArray().length).toEqual(array.length);
                    }
                },
                {
                    name: 'Should take N elements from beginning of collection',
                    action: (array, enumerable) => {
                        const countToTake = Math.floor(array.length / 2);

                        expect(enumerable.take(countToTake).select(i => valueProvider(i)).toArray()).toEqual(array.slice(0, countToTake));
                    }
                },
                {
                    name: 'Should cut off collection from the end if value less than zero',
                    action: (array, enumerable) => {
                        expect(enumerable.take(-1).select(i => valueProvider(i)).toArray()).toEqual(array.slice(0, array.length - 1));
                    }
                }
            ]
        );
    });

    describe('skip', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should skip all collection elements to skip greater than length',
                    action: (array, enumerable) => {
                        expect(enumerable.skip(array.length * 2).toArray().length).toEqual(0);
                    }
                },
                {
                    name: 'Should skip N elements',
                    action: (array, enumerable) => {
                        const countToSkip = Math.floor(array.length / 2);

                        expect(enumerable.skip(countToSkip).select(i => valueProvider(i)).toArray()).toEqual(array.slice(countToSkip));
                    }
                },
                {
                    name: 'Should take elements from the end of collection if value less than zero',
                    action: (array, enumerable) => {
                        expect(enumerable.skip(-1).select(i => valueProvider(i)).toArray()).toEqual([array[array.length - 1]]);
                    }
                }
            ]
        );
    });

    describe('except', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should return collection of elements that not contains in given collection',
                    action: (array, enumerable) => {
                        const except = array.slice(0, 5);
                        const expected = array.filter(i => !except.includes(i));

                        expect(enumerable.select(i => valueProvider(i)).except(enumerableFactory(except).select(i => valueProvider(i))).toArray()).toEqual(expected);
                    }
                },
                {
                    name: 'Should throw error if given collection is null or undefined',
                    action: (array, enumerable) => {
                        expect(() => enumerable.except(null)).toThrow();
                        expect(() => enumerable.except(undefined)).toThrow();
                    }
                },
                {
                    name: 'Should return collection of elements that not contains in given collection according to given equality comparer',
                    action: (array, enumerable) => {
                        const except = array.slice(0, 3);

                        const comparer = new TestNumberEqualityComparer();
                        const expected = array.filter(i => !except.some(e => comparer.equals(i, e)));

                        expect(enumerable.select(i => valueProvider(i)).except(enumerableFactory(except).select(i => valueProvider(i)), new TestNumberEqualityComparer()).toArray()).toEqual(expected);
                    }
                }
            ]
        );
    });

    describe('orderBy', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should order by ascending according to selected key',
                    action: (array, enumerable) => {
                        expect(enumerable.orderBy(i => valueProvider(i)).select(i => valueProvider(i)).toArray()).toEqual(array.sort((a, b) => a - b));
                    }
                },
                {
                    name: 'Should order by ascending according to selected key and comparer',
                    action: (array, enumerable) => {
                        const comparer = new TestNumberComparer();

                        expect(enumerable.orderBy(i => valueProvider(i), comparer).select(i => valueProvider(i)).toArray()).toEqual(array.sort((a, b) => comparer.compare(a, b)));
                    }
                },
                {
                    name: 'Should throw error if key selector is null or undefined',
                    action: (array, enumerable) => {
                        expect(() => enumerable.orderBy(null)).toThrow();
                        expect(() => enumerable.orderBy(undefined)).toThrow();
                    }
                }
            ]
        );
    });

    describe('thenBy', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should order by ascending according to selected key',
                    action: (array, enumerable) => {
                        const expectedResult = array.sort((a, b) => {
                            const firstResult = (a % 10) - (b % 10);
                            if (firstResult !== 0) {
                                return firstResult;
                            }

                            return (a % 5) - (b % 5);
                        });

                        const orderedEnumerable = enumerable.select(i => valueProvider(i)).orderBy(i => i % 10);

                        expect(orderedEnumerable.thenBy(i => i % 5).toArray()).toEqual(expectedResult);
                    }
                },
                {
                    name: 'Should order by ascending according to selected key and comparer',
                    action: (array, enumerable) => {
                        const comparer = new TestNumberComparer();

                        const expectedResult = array.sort((a, b) => {
                            const firstResult = (a % 3) - (b % 3);
                            if (firstResult !== 0) {
                                return firstResult;
                            }

                            return comparer.compare(a % 2, b % 2);
                        });

                        const orderedEnumerable = enumerable.select(i => valueProvider(i)).orderBy(i => i % 3);

                        expect(orderedEnumerable.thenBy(i => i % 2, comparer).toArray()).toEqual(expectedResult);
                    }
                },
                {
                    name: 'Should throw error if key selector is null or undefined',
                    action: (array, enumerable) => {
                        expect(() => enumerable.orderBy(i => i).thenBy(null)).toThrow();
                        expect(() => enumerable.orderBy(i => i).thenBy(undefined)).toThrow();
                    }
                }
            ]
        );
    });

    describe('orderByDescending', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should order by descending according to selected key',
                    action: (array, enumerable) => {
                        expect(enumerable.orderByDescending(i => valueProvider(i)).select(i => valueProvider(i)).toArray()).toEqual(array.sort((a, b) => b - a));
                    }
                },
                {
                    name: 'Should order by ascending according to selected key and comparer',
                    action: (array, enumerable) => {
                        const comparer = new TestNumberComparer();

                        expect(enumerable.orderByDescending(i => valueProvider(i), comparer).select(i => valueProvider(i)).toArray()).toEqual(array.sort((a, b) => comparer.compare(b, a)));
                    }
                },
                {
                    name: 'Should throw error if key selector is null or undefined',
                    action: (array, enumerable) => {
                        expect(() => enumerable.orderByDescending(null)).toThrow();
                        expect(() => enumerable.orderByDescending(undefined)).toThrow();
                    }
                }
            ]
        );
    });

    describe('thenByDescending', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should order by descending according to selected key',
                    action: (array, enumerable) => {
                        const expectedResult = array.sort((a, b) => {
                            const firstResult = (a % 3) - (b % 3);
                            if (firstResult !== 0) {
                                return firstResult;
                            }

                            return (b % 5) - (a % 5);
                        });

                        const orderedEnumerable = enumerable.select(i => valueProvider(i)).orderBy(i => i % 3);

                        expect(orderedEnumerable.thenByDescending(i => i % 5).toArray()).toEqual(expectedResult);
                    }
                },
                {
                    name: 'Should order by descending according to selected key and comparer',
                    action: (array, enumerable) => {
                        const comparer = new TestNumberComparer();

                        const expectedResult = array.sort((a, b) => {
                            const firstResult = (a % 6) - (b % 6);
                            if (firstResult !== 0) {
                                return firstResult;
                            }

                            return comparer.compare(b % 2, a % 2);
                        });

                        const orderedEnumerable = enumerable.select(i => valueProvider(i)).orderBy(i => i % 6);

                        expect(orderedEnumerable.thenByDescending(i => i % 2, comparer).toArray()).toEqual(expectedResult);
                    }
                },
                {
                    name: 'Should throw error if key selector is null or undefined',
                    action: (array, enumerable) => {
                        expect(() => enumerable.orderBy(i => i).thenByDescending(null)).toThrow();
                        expect(() => enumerable.orderBy(i => i).thenByDescending(undefined)).toThrow();
                    }
                }
            ]
        );
    });

    describe('groupBy', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should group by provided key',
                    action: (array, enumerable) => {
                        const expectedGroups = [];
                        for (const item of array) {
                            const group = expectedGroups.find(g => g.key === item);
                            if (group) {
                                group.values.push(item);
                            } else {
                                expectedGroups.push({
                                    key: item,
                                    values: [item]
                                });
                            }
                        }

                        expect(enumerable.select(i => valueProvider(i)).groupBy(i => i).select(g => {
                            return {
                                key: g.key,
                                values: g.toArray()
                            };
                        }).toArray()).toEqual(expectedGroups);
                    }
                },
                {
                    name: 'Should group by provided key with equality comparer',
                    action: (array, enumerable) => {
                        const expectedGroups = [];
                        const equalityComparer = new TestNumberEqualityComparer();
                        for (const item of array) {
                            const group = expectedGroups.find(g => equalityComparer.equals(g.key, item));
                            if (group) {
                                group.values.push(item);
                            } else {
                                expectedGroups.push({
                                    key: item,
                                    values: [item]
                                });
                            }
                        }

                        expect(enumerable.select(i => valueProvider(i)).groupBy(i => i, equalityComparer).select(g => {
                            return {
                                key: g.key,
                                values: g.toArray()
                            };
                        }).toArray()).toEqual(expectedGroups);
                    }
                },
                {
                    name: 'Should throw error if key selector is null or undefined',
                    action: (array, enumerable) => {
                        expect(() => enumerable.groupBy(null)).toThrow();
                        expect(() => enumerable.groupBy(undefined)).toThrow();
                    }
                }
            ]
        );
    });

    describe('forEach', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should properly iterate items',
                    action: (array, enumerable) => {
                        const expectedItems = [];
                        array.forEach((v, i) => expectedItems.push({
                            value: v,
                            index: i
                        }));

                        const items = [];
                        enumerable.forEach((v, i) => items.push({
                            value: valueProvider(v),
                            index: i
                        }));

                        expect(items).toEqual(expectedItems);
                    }
                },
                {
                    name: 'Should throw error if action is null or undefined',
                    action: (array, enumerable) => {
                        expect(() => enumerable.forEach(null)).toThrow();
                        expect(() => enumerable.forEach(undefined)).toThrow();
                    }
                }
            ]
        );
    });

    describe('toArray', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should produce proper array',
                    action: (array, enumerable) => {
                        expect(enumerable.select(i => valueProvider(i)).toArray()).toEqual(array);
                    }
                }
            ]
        );
    });

    describe('toList', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should produce proper list',
                    action: (array, enumerable) => {
                        const list = enumerable.toList();

                        expect(TypeUtils.is(list, List)).toBeTruthy();
                        expect(list.select(i => valueProvider(i)).toArray()).toEqual(array);
                    }
                }
            ]
        );
    });

    describe('toReadOnlyList', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should produce proper ReadOnlyList',
                    action: (array, enumerable) => {
                        const list = enumerable.toReadOnlyList();

                        expect(TypeUtils.is(list, List)).toBeTruthy();
                        expect(list.select(i => valueProvider(i)).toArray()).toEqual(array);
                    }
                }
            ]
        );
    });

    describe('toSet', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should produce proper Set',
                    action: (array, enumerable) => {
                        const set = enumerable.toSet();

                        expect(TypeUtils.is(set, MySet)).toBeTruthy();
                        expect(set.select(i => valueProvider(i)).toArray()).toEqual(Array.from(new Set(array)));
                    }
                },
                {
                    name: 'Should produce proper Set with equality comparer',
                    action: (array, enumerable) => {
                        const equalityComparer = new TestNumberEqualityComparer();
                        const expectedResult = [];
                        for (const item of array) {
                            if (!expectedResult.some(i => equalityComparer.equals(i, item))) {
                                expectedResult.push(item);
                            }
                        }

                        const set = enumerable.select(i => valueProvider(i)).toSet(equalityComparer);
                        expect(TypeUtils.is(set, MySet)).toBeTruthy();

                        expect(set.toArray()).toEqual(expectedResult);
                    }
                }
            ]
        );
    });

    describe('toReadOnlySet', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should produce proper ReadOnlySet',
                    action: (array, enumerable) => {
                        const set = enumerable.toReadOnlySet();

                        expect(TypeUtils.is(set, MySet)).toBeTruthy();
                        expect(set.select(i => valueProvider(i)).toArray()).toEqual(Array.from(new Set(array)));
                    }
                },
                {
                    name: 'Should produce proper ReadOnlySet with equality comparer',
                    action: (array, enumerable) => {
                        const equalityComparer = new TestNumberEqualityComparer();
                        const expectedResult = [];
                        for (const item of array) {
                            if (!expectedResult.some(i => equalityComparer.equals(i, item))) {
                                expectedResult.push(item);
                            }
                        }

                        const set = enumerable.select(i => valueProvider(i)).toReadOnlySet(equalityComparer);
                        expect(TypeUtils.is(set, MySet)).toBeTruthy();

                        expect(set.toArray()).toEqual(expectedResult);
                    }
                }
            ]
        );
    });

    describe('toDictionary', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should throw error if key selector or value selector is null or undefined',
                    action: (array, enumerable) => {
                        expect(() => enumerable.toDictionary(undefined, i => i)).toThrow();
                        expect(() => enumerable.toDictionary(null, i => i)).toThrow();

                        expect(() => enumerable.toDictionary(undefined, undefined)).toThrow();
                        expect(() => enumerable.toDictionary(null, null)).toThrow();

                        expect(() => enumerable.toDictionary(i => i, undefined)).toThrow();
                        expect(() => enumerable.toDictionary(i => i, null)).toThrow();
                    }
                },
                {
                    name: 'Should produce proper Dictionary',
                    action: (array, enumerable) => {
                        const expectedResult: IKeyValuePair<number, number>[] = [];
                        for (const item of array) {
                            if (!expectedResult.some(i => i.key === item)) {
                                expectedResult.push({
                                    key: item,
                                    value: item
                                });
                            }
                        }

                        const dictionary = enumerable.toDictionary(i => valueProvider(i), i => valueProvider(i));

                        expect(TypeUtils.is(dictionary, Dictionary)).toBeTruthy();
                        expect(dictionary.toArray()).toEqual(expectedResult);
                    }
                },
                {
                    name: 'Should produce proper Dictionary with equality comparer',
                    action: (array, enumerable) => {
                        const equalityComparer = new TestNumberEqualityComparer();
                        const expectedResult = getExpectedKeyValuePairs(array, equalityComparer);

                        const dictionary = enumerable.toDictionary(i => valueProvider(i), i => valueProvider(i), equalityComparer);

                        expect(TypeUtils.is(dictionary, Dictionary)).toBeTruthy();
                        expect(dictionary.toArray()).toEqual(expectedResult);
                    }
                }
            ]
        );
    });

    describe('toReadOnlyDictionary', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should throw error if key selector or value selector is null or undefined',
                    action: (array, enumerable) => {
                        expect(() => enumerable.toReadOnlyDictionary(undefined, i => i)).toThrow();
                        expect(() => enumerable.toReadOnlyDictionary(null, i => i)).toThrow();

                        expect(() => enumerable.toReadOnlyDictionary(undefined, undefined)).toThrow();
                        expect(() => enumerable.toReadOnlyDictionary(null, null)).toThrow();

                        expect(() => enumerable.toReadOnlyDictionary(i => i, undefined)).toThrow();
                        expect(() => enumerable.toReadOnlyDictionary(i => i, null)).toThrow();
                    }
                },
                {
                    name: 'Should produce proper ReadOnlyDictionary',
                    action: (array, enumerable) => {
                        const expectedResult: IKeyValuePair<number, number>[] = [];
                        for (const item of array) {
                            if (!expectedResult.some(i => i.key === item)) {
                                expectedResult.push({
                                    key: item,
                                    value: item
                                });
                            }
                        }

                        const dictionary = enumerable.toReadOnlyDictionary(i => valueProvider(i), i => valueProvider(i));

                        expect(TypeUtils.is(dictionary, Dictionary)).toBeTruthy();
                        expect(dictionary.toArray()).toEqual(expectedResult);
                    }
                },
                {
                    name: 'Should produce proper ReadOnlyDictionary with equality comparer',
                    action: (array, enumerable) => {
                        const equalityComparer = new TestNumberEqualityComparer();
                        const expectedResult = getExpectedKeyValuePairs(array, equalityComparer);

                        const dictionary = enumerable.toReadOnlyDictionary(i => valueProvider(i), i => valueProvider(i), equalityComparer);

                        expect(TypeUtils.is(dictionary, Dictionary)).toBeTruthy();
                        expect(dictionary.toArray()).toEqual(expectedResult);
                    }
                }
            ]
        );
    });

    describe('randomOrDefault', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should return default value when collection is empty',
                    action: (array, enumerable) => {
                        expect(enumerableFactory([]).randomOrDefault()).toBeUndefined();
                        expect(enumerableFactory([]).randomOrDefault(enumerable.getFirst())).toBe(enumerable.getFirst());
                        expect(enumerableFactory([]).randomOrDefault(null)).toBeNull();
                    }
                },
                {
                    name: 'Should return item that belongs to collection when collection is not empty',
                    action: (array, enumerable) => {
                        expect(enumerable.any(i => i === enumerable.randomOrDefault())).toBeTruthy();
                    }
                }
            ]
        );
    });
}

function getExpectedKeyValuePairs<T>(array: T[], equalityComparer: IEqualityComparer<T>): IKeyValuePair<T, T>[] {
    const result: IKeyValuePair<T, T>[] = [];
    for (const item of array) {
        const index = result.findIndex(i => equalityComparer.equals(i.key, item));
        if (index < 0) {
            result.push({
                key: item,
                value: item
            });
        } else {
            result[index] = {
                key: result[index].key,
                value: item
            };
        }
    }

    return result;
}

function testCases<T>(enumerableFactory: Func<IEnumerable<T>, number[]>, testCases: ITestCase<T>[]) {
    describe('Cases', () => {
        let array: number[];
        let enumerable: IEnumerable<T>;

        beforeEach(() => {
            array = createArray(normalArrayLength);
            enumerable = enumerableFactory(array);
        });

        for (const testCase of testCases) {
            it(testCase.name, () => {
                testCase.action(array, enumerable);
            });
        }
    });
}

// todo for each collection
/*function testPerformance<T>(enumerableFactory: Func<IEnumerable<T>, number[]>,
                            arrayAction: Action<number[], number>,
                            enumerableAction: Action<IEnumerable<T>, number>): void {
    describe('Performance', () => {
        testPerformanceByLength(smallArrayLength, enumerableFactory, arrayAction, enumerableAction);
        testPerformanceByLength(normalArrayLength, enumerableFactory, arrayAction, enumerableAction);
        testPerformanceByLength(bigArrayLength, enumerableFactory, arrayAction, enumerableAction);
        testPerformanceByLength(hugeArrayLength, enumerableFactory, arrayAction, enumerableAction);
    });
}

function testPerformanceByLength<T>(length: number,
                                    enumerableFactory: Func<IEnumerable<T>, number[]>,
                                    arrayAction: Action<number[], number>,
                                    enumerableAction: Action<IEnumerable<T>, number>) {
    it(`${length} elements`, () => {
        const array = createArray(length);
        const arrayExecutionTime = getActionExecutionTime(() => arrayAction(array, length));

        const enumerable = enumerableFactory(array);
        const enumerableExecutionTime = getActionExecutionTime(() => enumerableAction(enumerable, length));

        expect(enumerableExecutionTime).toBeLessThan(arrayExecutionTime + getAllowableError(length));
    });
}

function getAllowableError(length: number): number {
    return length > 100 ? length / 100 : length / 10;
}

function getActionExecutionTime(action: Action): number {
    const start = performance.now();

    action();

    const end = performance.now();

    return end - start;
}
*/

function createArray(length: number): number[] {
    const result = [];
    for (let i = 0; i < length; i++) {
        result.push((Math.random() - 0.5) * length);
    }

    return result;
}

function getRandomIndex(arrayLength: number): number {
    return Math.floor(Math.random() * (arrayLength - 1));
}

interface ITestCase<T> {
    readonly name: string,
    readonly action: Action<number[], IEnumerable<T>>
}

class TestEqualityComparer<T> implements IEqualityComparer<T> {
    public constructor(private readonly valueProvider: Func<number, T>) {
    }

    public equals(obj1: T, obj2: T): boolean {
        return new TestNumberEqualityComparer().equals(this.valueProvider(obj1), this.valueProvider(obj2));
    }
}

class TestNumberComparer implements IComparer<number> {
    public compare(obj1: number, obj2: number): number {
        return obj1 - obj2 + 3;
    }
}

class TestNumberEqualityComparer implements IEqualityComparer<number> {
    public equals(obj1: number, obj2: number): boolean {
        return obj1 > 0 && obj2 > 0;
    }
}
