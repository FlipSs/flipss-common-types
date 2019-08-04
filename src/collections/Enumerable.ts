import {Action, Func, Predicate} from "../types/internal";
import {Argument, TypeUtils} from "../utils/internal";
import {
    AscendingSortItemComparer,
    containsItem,
    DeferredEnumerable,
    DescendingSortItemComparer,
    Dictionary,
    getEqualityComparer,
    Grouping,
    IComparer,
    IDictionary,
    IEnumerable,
    IEqualityComparer,
    IGrouping,
    IKeyValuePair,
    IList,
    IOrderedEnumerable,
    IReadOnlyDictionary,
    IReadOnlyList,
    IReadOnlySet,
    ISet,
    List,
    OrderedEnumerable,
    Set
} from "./internal";

export function asEnumerable<T>(items: T[]): IEnumerable<T> {
    Argument.isNotNullOrUndefined(items, 'items');

    return new ArrayAsEnumerable([...items]);
}

export abstract class Enumerable<T> implements IEnumerable<T> {
    private get value(): T[] {
        return this.getValue() || [];
    }

    public all(predicate: Predicate<T>): boolean {
        Argument.isNotNullOrUndefined(predicate, 'predicate');

        return this.value.every(i => predicate(i));
    }

    public any(predicate?: Predicate<T>): boolean {
        if (TypeUtils.isNullOrUndefined(predicate)) {
            return this.value.length > 0;
        }

        return this.value.some(v => predicate(v));
    }

    public append(value: T): IEnumerable<T> {
        return createDeferred(() => [...this.value, value]);
    }

    public concat(other: IEnumerable<T>): IEnumerable<T> {
        Argument.isNotNullOrUndefined(other, 'other');

        return createDeferred(() => {
            const otherItems = other.toArray();
            if (TypeUtils.isNullOrUndefined(otherItems)) {
                return this.value;
            }

            return [...this.value, ...otherItems];
        });
    }

    public contains(value: T, comparer?: IEqualityComparer<T>): boolean {
        const equalityComparer = getEqualityComparer(comparer);

        return containsItem(this.value, value, equalityComparer);
    }

    public count(predicate?: Predicate<T>): number {
        if (TypeUtils.isNullOrUndefined(predicate)) {
            return this.value.length;
        }

        return this.value.filter(i => predicate(i)).length;
    }

    public getElementAt(index: number): T {
        const value = this.value;
        if (isIndexOutOfRange(value, index)) {
            throw new RangeError(`The argument must be between 0 and ${value.length}.`);
        }

        return value[index];
    }

    public getElementAtOrDefault(index: number, defaultValue?: T): T | undefined {
        const value = this.value;
        if (isIndexOutOfRange(value, index)) {
            return defaultValue;
        }

        return value[index];
    }

    public except(other: IEnumerable<T>, comparer?: IEqualityComparer<T>): IEnumerable<T> {
        Argument.isNotNullOrUndefined(other, 'other');

        return createDeferred(() => {
            const otherItems = other.toArray();
            if (TypeUtils.isNullOrUndefined(otherItems)) {
                return this.value;
            }

            const equalityComparer = getEqualityComparer(comparer);

            return this.value.filter(item => !containsItem(otherItems, item, equalityComparer));
        });
    }

    public getFirst(predicate?: Predicate<T>): T {
        const value = this.value;

        ensureNotEmpty(value);

        return getFirstOrDefault(value, () => {
            throw new Error('Item not found');
        }, predicate);
    }

    public getFirstOrDefault(predicate?: Predicate<T>, defaultValue?: T): T | undefined {
        const value = this.value;

        if (isEmpty(value)) {
            return defaultValue;
        }

        return getFirstOrDefault(value, () => defaultValue, predicate);
    }

    public groupBy<TKey>(keySelector: Func<TKey, T>, comparer?: IEqualityComparer<TKey>): IEnumerable<IGrouping<TKey, T>> {
        Argument.isNotNullOrUndefined(keySelector, 'keySelector');

        return createDeferred(() => {
            const value = this.value;

            const equalityComparer = getEqualityComparer(comparer);
            const groupings: { key: TKey, value: T[] }[] = [];
            for (const item of value) {
                const key = keySelector(item);

                const grouping = groupings.find(i => equalityComparer.equals(i.key, key));
                if (TypeUtils.isNullOrUndefined(item)) {
                    groupings.push({
                        key: key,
                        value: [item]
                    })
                } else {
                    grouping.value.push(item);
                }
            }

            return groupings.map(g => new Grouping(g.key, g.value));
        });
    }

    public getLast(predicate?: Predicate<T>): T {
        const value = this.value;

        ensureNotEmpty(value);

        return getLastOrDefault(value, () => {
            throw new Error('Item not found');
        }, predicate);
    }

    public getLastOrDefault(predicate?: Predicate<T>, defaultValue?: T): T | undefined {
        const value = this.value;

        if (isEmpty(value)) {
            return defaultValue;
        }

        return getLastOrDefault(value, () => defaultValue, predicate);
    }

    public orderBy<TKey>(keySelector: Func<TKey, T>, comparer?: IComparer<TKey>): IOrderedEnumerable<T> {
        Argument.isNotNullOrUndefined(keySelector, 'keySelector');

        const sortItemSelector = new AscendingSortItemComparer(keySelector, comparer);

        return new OrderedEnumerable(() => this.value, sortItemSelector);
    }

    public orderByDescending<TKey>(keySelector: Func<TKey, T>, comparer?: IComparer<TKey>): IOrderedEnumerable<T> {
        Argument.isNotNullOrUndefined(keySelector, 'keySelector');

        const sortItemSelector = new DescendingSortItemComparer(keySelector, comparer);

        return new OrderedEnumerable(() => this.value, sortItemSelector);
    }

    public prepend(value: T): IEnumerable<T> {
        return createDeferred(() => [value, ...this.value]);
    }

    public select<TResult>(selector: Func<TResult, T>): IEnumerable<TResult> {
        Argument.isNotNullOrUndefined(selector, 'selector');

        return createDeferred(() => this.value.map(i => selector(i)));
    }

    public selectMany<TResult>(selector: Func<TResult[], T>): IEnumerable<TResult> {
        Argument.isNotNullOrUndefined(selector, 'selector');

        return createDeferred(() => {
            const resultItems = [];
            this.value.map(i => selector(i)).forEach(i => {
                resultItems.push(...i);
            });

            return resultItems;
        });
    }

    public where(predicate: Predicate<T>): IEnumerable<T> {
        Argument.isNotNullOrUndefined(predicate, 'predicate');

        return createDeferred(() => this.value.filter(i => predicate(i)));
    }

    public toArray(): T[] {
        return [...this.value];
    }

    public forEach(action: Action<T, number>): void {
        Argument.isNotNullOrUndefined(action, 'action');

        this.value.forEach((e, i) => action(e, i));
    }

    public [Symbol.iterator](): Iterator<T> {
        return this.value[Symbol.iterator]();
    }

    public reverse(): IEnumerable<T> {
        return createDeferred(() => this.value.reverse());
    }

    public toList(): IList<T> {
        return new List(this.value);
    }

    public toReadOnlyList(): IReadOnlyList<T> {
        return this.toList();
    }

    public toSet(comparer?: IEqualityComparer<T>): ISet<T> {
        return new Set(this.value, comparer);
    }

    public toReadOnlySet(comparer?: IEqualityComparer<T>): IReadOnlySet<T> {
        return this.toSet(comparer);
    }

    public toDictionary<TKey, TValue>(keySelector: Func<TKey, T>, valueSelector: Func<TValue, T>, comparer?: IEqualityComparer<TKey>): IDictionary<TKey, TValue> {
        Argument.isNotNullOrUndefined(keySelector, 'keySelector');
        Argument.isNotNullOrUndefined(valueSelector, 'valueSelector');

        const keyValuePairs: IKeyValuePair<TKey, TValue>[] = this.value.map(v => {
            return {
                key: keySelector(v),
                value: valueSelector(v)
            };
        });

        return new Dictionary(keyValuePairs, comparer);
    }

    public toReadOnlyDictionary<TKey, TValue>(keySelector: Func<TKey, T>, valueSelector: Func<TValue, T>, comparer?: IEqualityComparer<TKey>): IReadOnlyDictionary<TKey, TValue> {
        return this.toDictionary(keySelector, valueSelector, comparer);
    }

    public skip(count: number): IEnumerable<T> {
        return createDeferred(() => this.value.slice(count));
    }

    public take(count: number): IEnumerable<T> {
        return createDeferred(() => this.value.slice(0, count - 1));
    }

    public average(valueProvider: Func<number, T>): number {
        Argument.isNotNullOrUndefined(valueProvider, 'valueProvider');

        const value = this.value;

        return calculateSum(value, valueProvider) / value.length;
    }

    public min(valueProvider: Func<number, T>): number {
        Argument.isNotNullOrUndefined(valueProvider, 'valueProvider');

        const value = this.value;

        return findBestMatchingValue(value, valueProvider, (n, o) => n < o);
    }

    public sum(valueProvider: Func<number, T>): number {
        Argument.isNotNullOrUndefined(valueProvider, 'valueProvider');

        const value = this.value;

        return calculateSum(value, valueProvider);
    }

    public max(valueProvider: Func<number, T>): number {
        Argument.isNotNullOrUndefined(valueProvider, 'valueProvider');

        const value = this.value;

        return findBestMatchingValue(value, valueProvider, (n, o) => n > o);
    }

    public distinct(comparer?: IEqualityComparer<T>): IEnumerable<T> {
        return createDeferred(() => {
            const value = this.value;

            const equalityComparer = getEqualityComparer(comparer);
            const result: T[] = [];
            for (const item of value) {
                if (!containsItem(result, item, equalityComparer)) {
                    result.push(item);
                }
            }

            return result;
        });
    }

    public defaultIfEmpty(defaultValue: T): IEnumerable<T> {
        return createDeferred(() => {
            const value = this.value;
            if (isEmpty(value)) {
                return [defaultValue];
            }

            return value;
        });
    }

    protected abstract getValue(): T[];
}

class ArrayAsEnumerable<T> extends Enumerable<T> {
    public constructor(private readonly items: T[]) {
        super();
    }

    protected getValue(): T[] {
        return this.items;
    }
}

function createDeferred<T>(valueFactory: Func<T[]>): IEnumerable<T> {
    return new DeferredEnumerable(valueFactory);
}

function getFirstOrDefault<T>(value: T[], defaultValueFactory: Func<T>, predicate?: Predicate<T>): T {
    if (TypeUtils.isNullOrUndefined(predicate)) {
        return value[0];
    }

    for (const item of value) {
        if (predicate(item)) {
            return item;
        }
    }

    return defaultValueFactory();
}

function getLastOrDefault<T>(value: T[], defaultValueFactory: Func<T>, predicate?: Predicate<T>): T {
    if (TypeUtils.isNullOrUndefined(predicate)) {
        return value[getLastIndex(value)];
    }

    for (let i = getLastIndex(value); i >= 0; i--) {
        const item = value[i];
        if (predicate(item)) {
            return item;
        }
    }

    return defaultValueFactory();
}

function getLastIndex<T>(value: T[]): number {
    return value.length - 1;
}

function isIndexOutOfRange<T>(value: T[], index: number): boolean {
    return index < 0 || index >= value.length;
}

function findBestMatchingValue<T, TValue>(array: T[], valueProvider: Func<TValue, T>, predicate: Predicate<TValue, TValue>): TValue {
    ensureNotEmpty(array);

    let result = valueProvider(array[0]);
    for (let i = 1; i < array.length; i++) {
        const item = valueProvider(array[i]);
        if (predicate(item, result)) {
            result = item;
        }
    }

    return result;
}

function calculateSum<T>(array: T[], valueProvider: Func<number, T>): number {
    ensureNotEmpty(array);

    let result = 0;
    for (const item of array) {
        result += valueProvider(item);
    }

    return result;
}

function ensureNotEmpty<T>(value: T[]): void {
    if (isEmpty(value)) {
        throw new RangeError('Enumerable is empty.');
    }
}

function isEmpty<T>(value: T[]): boolean {
    return value.length === 0;
}
