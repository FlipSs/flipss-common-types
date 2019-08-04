import {IEnumerable, IEqualityComparer} from "../../../src/collections/internal";
import {Action, Func} from "../../../src/types/internal";
import {performance} from 'perf_hooks';

const smallArrayLength = 100;
const normalArrayLength = 1000;
const bigArrayLength = 10000;
const hugeArrayLength = 100000;
const timeDifferenceCoefficient = 0.001;

export function testEnumerable(enumerableFactory: Func<IEnumerable<number>, number[]>) {
    return testEnumerableGeneric(enumerableFactory, v => v, 17);
}

export function testEnumerableGeneric<T>(enumerableFactory: Func<IEnumerable<T>, number[]>, valueProvider: Func<number, T>, defaultValue: T): void {
    describe('Iterator', () => {
        testCases(enumerableFactory,
            [
                {
                    name: 'Should iterate throw collection',
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
                        for (const item of array) {
                            if (item <= 0 || !expectedItems.some(i => i > 0)) {
                                expectedItems.push(item);
                            }
                        }

                        expect(enumerable.distinct(new TestEqualityComparer(valueProvider)).toArray().map(i => valueProvider(i))).toEqual(expectedItems);
                    }
                },
                {
                    name: 'Should not throw if empty',
                    action: () => {
                        expect(() => enumerableFactory([]).distinct()).not.toThrow();
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
            return e.distinct();
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

        expect(enumerableExecutionTime).toBeLessThan(arrayExecutionTime + length * timeDifferenceCoefficient);
    });
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
        return this.valueProvider(obj1) > 0 && this.valueProvider(obj2) > 0;
    }
}
