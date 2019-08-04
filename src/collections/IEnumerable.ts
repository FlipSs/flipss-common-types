import {Action, Func, Predicate} from "../types/internal";
import {
    ICollection,
    IComparer,
    IDictionary,
    IEqualityComparer,
    IGrouping,
    IHashSet,
    IOrderedEnumerable,
    IReadOnlyCollection,
    IReadOnlyDictionary,
    IReadOnlyHashSet
} from "./internal";

export interface IEnumerable<T> extends Iterable<T> {
    getElementAt(index: number): T;

    getElementAtOrDefault(index: number, defaultValue?: T): T | undefined;

    getCount(predicate?: Predicate<T>): number;

    any(predicate?: Predicate<T>): boolean;

    all(predicate: Predicate<T>): boolean;

    getFirst(): T;

    getLast(): T;

    distinct(comparer?: IEqualityComparer<T>): IEnumerable<T>;

    defaultIfEmpty(defaultValue: T): IEnumerable<T>;

    getLastOrDefault(predicate?: Predicate<T>, defaultValue?: T): T | undefined;

    getFirstOrDefault(predicate?: Predicate<T>, defaultValue?: T): T | undefined;

    where(predicate: Predicate<T>): IEnumerable<T>;

    select<TResult>(selector: Func<TResult, T>): IEnumerable<TResult>;

    selectMany<TResult>(selector: Func<TResult[], T>): IEnumerable<TResult>;

    concat(other: IEnumerable<T>): IEnumerable<T>;

    contains(value: T, comparer?: IEqualityComparer<T>): boolean;

    reverse(): IEnumerable<T>;

    append(value: T): IEnumerable<T>;

    prepend(value: T): IEnumerable<T>;

    max(valueProvider: Func<number, T>): number;

    min(valueProvider: Func<number, T>): number;

    average(valueProvider: Func<number, T>): number;

    sum(valueProvider: Func<number, T>): number;

    take(count: number): IEnumerable<T>;

    skip(count: number): IEnumerable<T>;

    except(other: IEnumerable<T>, comparer?: IEqualityComparer<T>): IEnumerable<T>;

    orderBy<TKey>(keySelector: Func<TKey, T>, comparer?: IComparer<TKey>): IOrderedEnumerable<T>;

    orderByDescending<TKey>(keySelector: Func<TKey, T>, comparer?: IComparer<TKey>): IOrderedEnumerable<T>;

    groupBy<TKey>(keySelector: Func<TKey, T>, comparer?: IEqualityComparer<TKey>): IEnumerable<IGrouping<TKey, T>>;

    forEach(action: Action<T, number>): void;

    toArray(): T[];

    toCollection(): ICollection<T>;

    toReadOnlyCollection(): IReadOnlyCollection<T>;

    toHashSet(comparer?: IEqualityComparer<T>): IHashSet<T>;

    toReadOnlyHashSet(comparer?: IEqualityComparer<T>): IReadOnlyHashSet<T>;

    toDictionary<TKey, TValue>(keySelector: Func<TKey, T>, valueSelector: Func<TValue, T>, comparer?: IEqualityComparer<TKey>): IDictionary<TKey, TValue>;

    toReadOnlyDictionary<TKey, TValue>(keySelector: Func<TKey, T>, valueSelector: Func<TValue, T>, comparer?: IEqualityComparer<TKey>): IReadOnlyDictionary<TKey, TValue>;
}
