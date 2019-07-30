import {Action, Func, Predicate} from "../types";
import {IEnumerable} from "./IEnumerable";
import {Argument, TypeUtils} from "../utils";
import {IGrouping} from "./grouping/IGrouping";
import {Grouping} from "./grouping/Grouping";
import {IOrderedEnumerable} from "./sorting/IOrderedEnumerable";
import {AscendingSortItemSelector} from "./sorting/AscendingSortItemSelector";
import {OrderedEnumerable} from "./sorting/OrderedEnumerable";
import {DescendingSortItemSelector} from "./sorting/DescendingSortItemSelector";
import {ICollection} from "./ICollection";
import {IReadOnlyCollection} from "./IReadOnlyCollection";
import {Collection} from "./Collection";
import {DeferredEnumerable} from "./DeferredEnumerable";
import {IHashSet} from "./IHashSet";
import {HashSet} from "./HashSet";
import {IReadOnlyHashSet} from "./IReadOnlyHashSet";
import {IDictionary} from "./IDictionary";
import {IReadOnlyDictionary} from "./IReadOnlyDictionary";
import {Dictionary} from "./Dictionary";
import {IKeyValuePair} from "./IKeyValuePair";

export function asEnumerable<T>(items: T[]): IEnumerable<T> {
    return new ArrayAsEnumerable(items);
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

    public contains(value: T): boolean {
        return this.value.indexOf(value) >= 0;
    }

    public getCount(predicate?: Predicate<T>): number {
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

    public except(other: IEnumerable<T>): IEnumerable<T> {
        Argument.isNotNullOrUndefined(other, 'other');

        return createDeferred(() => {
            const otherItems = other.toArray();
            if (TypeUtils.isNullOrUndefined(otherItems)) {
                return this.value;
            }

            const otherElementSet = new Set<T>(otherItems);

            return this.value.filter(i => !otherElementSet.has(i));
        });
    }

    public getFirst(): T {
        const value = this.value;

        ensureNotEmpty(value);

        return getFirst(value);
    }

    public getFirstOrDefault(predicate?: Predicate<T>, defaultValue?: T): T | undefined {
        const value = this.value;

        if (isEmpty(value)) {
            return defaultValue;
        }

        if (TypeUtils.isNullOrUndefined(predicate)) {
            return getFirst(value);
        }

        for (const item of value) {
            if (predicate(item)) {
                return item;
            }
        }

        return defaultValue;
    }

    public groupBy<TKey>(keySelector: Func<TKey, T>): IEnumerable<IGrouping<TKey, T>> {
        Argument.isNotNullOrUndefined(keySelector, 'keySelector');

        return createDeferred(() => {
            const value = this.value;

            const groupMap = new Map<TKey, T[]>();
            for (const item of value) {
                const key = keySelector(item);

                if (groupMap.has(key)) {
                    groupMap.get(key).push(item);
                } else {
                    groupMap.set(key, [item]);
                }
            }

            const result = [];

            groupMap.forEach((v, k) => result.push(new Grouping(k, v)));

            return result;
        });
    }

    public getLast(): T {
        const value = this.value;

        ensureNotEmpty(value);

        return getLast(value);
    }

    public getLastOrDefault(predicate?: Predicate<T>, defaultValue?: T): T | undefined {
        const value = this.value;

        if (isEmpty(value)) {
            return defaultValue;
        }

        if (TypeUtils.isNullOrUndefined(predicate)) {
            return getLast(value);
        }

        for (let i = getLastIndex(value); i >= 0; i--) {
            const item = value[i];
            if (predicate(item)) {
                return item;
            }
        }

        return defaultValue;
    }

    public orderBy<TKey>(keySelector: Func<TKey, T>): IOrderedEnumerable<T> {
        Argument.isNotNullOrUndefined(keySelector, 'keySelector');

        const sortItemSelector = new AscendingSortItemSelector(keySelector);

        return new OrderedEnumerable(() => this.value, sortItemSelector);
    }

    public orderByDescending<TKey>(keySelector: Func<TKey, T>): IOrderedEnumerable<T> {
        Argument.isNotNullOrUndefined(keySelector, 'keySelector');

        const sortItemSelector = new DescendingSortItemSelector(keySelector);

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

    public toCollection(): ICollection<T> {
        return new Collection(this.value);
    }

    public toReadOnlyCollection(): IReadOnlyCollection<T> {
        return this.toCollection();
    }

    public toHashSet(): IHashSet<T> {
        return new HashSet(this.value);
    }

    public toReadOnlyHashSet(): IReadOnlyHashSet<T> {
        return this.toHashSet();
    }

    public toDictionary<TKey, TValue>(keySelector: Func<TKey, T>, valueSelector: Func<TValue, T>): IDictionary<TKey, TValue> {
        Argument.isNotNullOrUndefined(keySelector, 'keySelector');
        Argument.isNotNullOrUndefined(valueSelector, 'valueSelector');

        const keyValuePairs: IKeyValuePair<TKey, TValue>[] = this.value.map(v => {
            return {
                key: keySelector(v),
                value: valueSelector(v)
            };
        });

        return new Dictionary(keyValuePairs);
    }

    public toReadOnlyDictionary<TKey, TValue>(keySelector: Func<TKey, T>, valueSelector: Func<TValue, T>): IReadOnlyDictionary<TKey, TValue> {
        return this.toDictionary(keySelector, valueSelector);
    }

    public skip(count: number): IEnumerable<T> {
        return createDeferred(() => this.value.slice(count));
    }

    public take(count: number): IEnumerable<T> {
        return createDeferred(() => this.value.slice(0, count - 1));
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

function getFirst<T>(value: T[]) {
    return value[0];
}

function getLast<T>(value: T[]) {
    return value[getLastIndex(value)];
}

function getLastIndex<T>(value: T[]) {
    return value.length - 1;
}

function isIndexOutOfRange<T>(value: T[], index: number) {
    return index < 0 || index >= value.length;
}

function ensureNotEmpty<T>(value: T[]) {
    if (isEmpty(value)) {
        throw new RangeError('Enumerable is empty.');
    }
}

function isEmpty<T>(value: T[]) {
    return value.length === 0;
}
