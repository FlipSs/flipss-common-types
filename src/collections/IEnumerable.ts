import {Action, Func, Predicate} from "../types/internal";
import {
    IComparer,
    IDictionary,
    IEqualityComparer,
    IGrouping,
    IList,
    IOrderedEnumerable,
    IReadOnlyDictionary,
    IReadOnlyList,
    IReadOnlySet,
    ISet
} from "./internal";

export interface IEnumerable<T> extends Iterable<T> {
    getElementAt(index: number): T;

    getElementAtOrDefault(index: number, defaultValue?: T): T | undefined;

    count(predicate?: Predicate<T>): number;

    any(predicate?: Predicate<T>): boolean;

    all(predicate: Predicate<T>): boolean;

    getFirst(predicate?: Predicate<T>): T;

    getLast(predicate?: Predicate<T>): T;

    distinct(comparer?: IEqualityComparer<T>): IEnumerable<T>;

    defaultIfEmpty(defaultValue: T): IEnumerable<T>;

    getLastOrDefault(predicate?: Predicate<T>, defaultValue?: T): T | undefined;

    getFirstOrDefault(predicate?: Predicate<T>, defaultValue?: T): T | undefined;

    where(predicate: Predicate<T, number>): IEnumerable<T>;

    select<TResult>(selector: Func<TResult, T, number>): IEnumerable<TResult>;

    selectMany<TResult>(selector: Func<Iterable<TResult>, T>): IEnumerable<TResult>;

    concat(other: Iterable<T>): IEnumerable<T>;

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

    except(other: Iterable<T>, comparer?: IEqualityComparer<T>): IEnumerable<T>;

    orderBy<TKey>(keySelector: Func<TKey, T>, comparer?: IComparer<TKey>): IOrderedEnumerable<T>;

    orderByDescending<TKey>(keySelector: Func<TKey, T>, comparer?: IComparer<TKey>): IOrderedEnumerable<T>;

    groupBy<TKey>(keySelector: Func<TKey, T>, comparer?: IEqualityComparer<TKey>): IEnumerable<IGrouping<TKey, T>>;

    forEach(action: Action<T, number>): void;

    toArray(): T[];

    toList(): IList<T>;

    toReadOnlyList(): IReadOnlyList<T>;

    toSet(comparer?: IEqualityComparer<T>): ISet<T>;

    toReadOnlySet(comparer?: IEqualityComparer<T>): IReadOnlySet<T>;

    toDictionary<TKey, TValue>(keySelector: Func<TKey, T>, valueSelector: Func<TValue, T>, comparer?: IEqualityComparer<TKey>): IDictionary<TKey, TValue>;

    toReadOnlyDictionary<TKey, TValue>(keySelector: Func<TKey, T>, valueSelector: Func<TValue, T>, comparer?: IEqualityComparer<TKey>): IReadOnlyDictionary<TKey, TValue>;

    randomOrDefault(defaultValue?: T): T;

    shuffle(): IEnumerable<T>;
}
