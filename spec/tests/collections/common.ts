import {IEnumerable, IEqualityComparer} from "../../../src/collections/internal";
import {Action, Func} from "../../../src/types/internal";
import {performance} from 'perf_hooks';

const smallArrayLength = 10;
const normalArrayLength = 100;
const bigArrayLength = 1000;
const hugeArrayLength = 10000;

export function testEnumerable(enumerableFactory: Func<IEnumerable<number>, number[]>) {
    return testEnumerableGeneric(enumerableFactory, v => v, 17);
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

        testPerformance(enumerableFactory, (a, l) => {
            for (const item of a) {
            }
        }, (e, l) => {
            for (const item of e) {
            }
        });
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

        testPerformance(enumerableFactory, (a, l) => {
            for (let i = 0; i < l; i++) {
                const item = a[i];
            }
        }, (e, l) => {
            for (let i = 0; i < l; i++) {
                const item = e.getElementAt(i);
            }
        });
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

        testPerformance(enumerableFactory, (a, l) => {
            for (let i = 0; i < l; i++) {
                const item = a[i];
            }
        }, (e, l) => {
            for (let i = 0; i < l; i++) {
                const item = e.getElementAtOrDefault(i);
            }
        });
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

        testPerformance(enumerableFactory, a => {
            return Math.random() >= 0.5 ? a.filter(i => i < 0).length : a.length;
        }, e => {
            return Math.random() >= 0.5 ? e.count(i => valueProvider(i) < 0) : e.count();
        });
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

        testPerformance(enumerableFactory, a => {
            const random = Math.random();

            return random >= 0.5 ? a.some(i => i === random) : a.length > 0;
        }, e => {
            const random = Math.random();

            return random >= 0.5 ? e.any(i => valueProvider(i) === random) : e.any();
        });
    });

    describe('all', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should return true if all elements match predicate',
                    action: (array, enumerable) => {
                        expect(enumerable.all(i => true)).toBeTruthy();
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

        testPerformance(enumerableFactory, a => {
            return a.every(i => Math.random() >= 0.5);
        }, e => {
            return e.all(i => Math.random() >= 0.5);
        });
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
                        expect(() => enumerable.getFirst(i => false)).toThrow();
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

        testPerformance(enumerableFactory, a => {
            return Math.random() >= 0.5 ? a[0] : a.find(i => true);
        }, e => {
            return Math.random() >= 0.5 ? e.getFirst() : e.getFirst(i => true);
        });
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
                        expect(() => enumerable.getLast(i => false)).toThrow();
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

        testPerformance(enumerableFactory, a => {
            if (Math.random() >= 0.5) {
                return a[a.length - 1];
            }

            for (let i = a.length - 1; i >= 0; i--) {
                if (true) {
                    return a[i];
                }
            }
        }, e => {
            return Math.random() >= 0.5 ? e.getLast() : e.getLast(i => true);
        });
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

        testPerformance(enumerableFactory, a => {
            const result = [];
            for (const item of a) {
                if (!result.includes(item)) {
                    result.push(item);
                }
            }

            return result;
        }, e => {
            return e.distinct().toArray();
        });
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

        testPerformance(enumerableFactory, a => {
            if (a.length === 0) {
                return [0];
            }

            return a;
        }, e => {
            return e.defaultIfEmpty(defaultValue).toArray();
        });
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
                        expect(enumerable.getLastOrDefault(i => false, defaultValue)).toBe(defaultValue);
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

        testPerformance(enumerableFactory, a => {
            if (Math.random() >= 0.5) {
                return a[a.length - 1];
            }

            for (let i = a.length - 1; i >= 0; i--) {
                if (i > 0) {
                    return a[i];
                }
            }

            return 0;
        }, e => {
            return Math.random() >= 0.5 ? e.getLastOrDefault() : e.getLastOrDefault(i => valueProvider(i) > 0, defaultValue);
        });
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
                        expect(enumerable.getFirstOrDefault(i => false, defaultValue)).toBe(defaultValue);
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

        testPerformance(enumerableFactory, a => {
            return Math.random() >= 0.5 ? a[0] : a.find(i => i < 0) || 0;
        }, e => {
            return Math.random() >= 0.5 ? e.getFirstOrDefault() : e.getFirstOrDefault(i => valueProvider(i) < 0, defaultValue);
        });
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

        testPerformance(enumerableFactory, a => {
            return a.filter(i => i === 15);
        }, e => {
            return e.where(i => i === defaultValue).toArray();
        });
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

        testPerformance(enumerableFactory, a => {
            return a.map(i => 15);
        }, e => {
            return e.select(i => defaultValue).toArray();
        });
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

        testPerformance(enumerableFactory, a => {
            const result = [];
            a.forEach(i => result.push(i, i, i, i, i));

            return result;
        }, e => {
            return e.selectMany(i => [i, i, i, i, i]).toArray();
        });
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

        testPerformance(enumerableFactory, a => {
            return [...a, ...a];
        }, e => {
            return e.concat(e).toArray();
        });
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

        testPerformance(enumerableFactory, a => {
            return Math.random() >= 0.5 ? a.includes(1) : a.some(i => 13 > 0 && i > 0);
        }, e => {
            return Math.random() >= 0.5 ? e.select(i => valueProvider(i)).contains(1) : e.select(i => valueProvider(i)).contains(13, new TestNumberEqualityComparer());
        });
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

        testPerformance(enumerableFactory, a => {
            return a.reverse();
        }, e => {
            return e.reverse().toArray();
        });
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

        testPerformance(enumerableFactory, a => {
            return [...a, 0];
        }, e => {
            return e.append(defaultValue).toArray();
        });
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

        testPerformance(enumerableFactory, a => {
            return [0, ...a];
        }, e => {
            return e.prepend(defaultValue).toArray();
        });
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

        testPerformance(enumerableFactory, a => {
            let max = a[0];
            for (let i = 1; i < a.length; i++) {
                if (a[i] > max) {
                    max = a[i];
                }
            }

            return max;
        }, e => {
            return e.max(valueProvider);
        });
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

        testPerformance(enumerableFactory, a => {
            let min = a[0];
            for (let i = 1; i < a.length; i++) {
                if (a[i] < min) {
                    min = a[i];
                }
            }

            return min;
        }, e => {
            return e.min(valueProvider);
        });
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

        testPerformance(enumerableFactory, a => {
            let sum = 0;
            for (const item of a) {
                sum += item;
            }

            return sum;
        }, e => {
            return e.sum(valueProvider);
        });
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

        testPerformance(enumerableFactory, a => {
            let sum = 0;
            for (const item of a) {
                sum += item;
            }

            return sum / a.length;
        }, e => {
            return e.average(valueProvider);
        });
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

        testPerformance(enumerableFactory, a => {
            return a.slice(0, 5);
        }, e => {
            return e.take(5).toArray();
        });
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

        testPerformance(enumerableFactory, a => {
            return a.slice(5);
        }, e => {
            return e.skip(5).toArray();
        });
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

        testPerformance(enumerableFactory, a => {
            if (Math.random() >= 0.5) {
                const except = [0, 1, 2, 3, 4];

                return a.filter(i => !except.includes(i));
            }

            const toExcept = [0];
            const comparer = new TestNumberEqualityComparer();

            return a.filter(i => !toExcept.some(e => comparer.equals(i, e)));
        }, e => {
            return Math.random() >= 0.5 ? e.except(enumerableFactory([0, 1, 2, 3, 4])).toArray() : e.except(enumerableFactory([0]), new TestEqualityComparer(valueProvider)).toArray();
        });
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
                    name: 'Should throw error if key selector is null or undefined',
                    action: (array, enumerable) => {
                        expect(() => enumerable.orderBy(null)).toThrow();
                        expect(() => enumerable.orderBy(undefined)).toThrow();
                    }
                }
            ]
        );

        // todo
        testPerformance(enumerableFactory, a => {
        }, e => {
        });
    });
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

function testPerformance<T>(enumerableFactory: Func<IEnumerable<T>, number[]>,
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

class TestNumberEqualityComparer implements IEqualityComparer<number> {
    public equals(obj1: number, obj2: number): boolean {
        return obj1 > 0 && obj2 > 0;
    }
}
