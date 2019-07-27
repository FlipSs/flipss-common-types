import {Action, Func, Predicate} from "../types";
import {IOrderedEnumerable} from "./sorting/IOrderedEnumerable";
import {IGrouping} from "./grouping/IGrouping";
import {ICollection} from "./ICollection";
import {IReadOnlyCollection} from "./IReadOnlyCollection";
import {IHashSet} from "./IHashSet";
import {IReadOnlyHashSet} from "./IReadOnlyHashSet";
import {IDictionary} from "./IDictionary";
import {IReadOnlyDictionary} from "./IReadOnlyDictionary";

export interface IEnumerable<T> extends Iterable<T> {
    getElementAt(index: number): T;

    getElementAtOrDefault(index: number, defaultValue?: T): T;

    getCount(predicate?: Predicate<T>): number;

    any(predicate?: Predicate<T>): boolean;

    all(predicate: Predicate<T>): boolean;

    getFirst(): T;

    getLast(): T;

    getLastOrDefault(predicate?: Predicate<T>, defaultValue?: T): T;

    getFirstOrDefault(predicate?: Predicate<T>, defaultValue?: T): T;

    where(predicate: Predicate<T>): IEnumerable<T>;

    select<TResult>(selector: Func<TResult, T>): IEnumerable<TResult>;

    selectMany<TResult>(selector: Func<TResult[], T>): IEnumerable<TResult>;

    concat(other: IEnumerable<T>): IEnumerable<T>;

    contains(value: T): boolean;

    reverse(): IEnumerable<T>;

    append(value: T): IEnumerable<T>;

    prepend(value: T): IEnumerable<T>;

    except(other: IEnumerable<T>): IEnumerable<T>;

    orderBy<TKey>(keySelector: Func<TKey, T>): IOrderedEnumerable<T>;

    orderByDescending<TKey>(keySelector: Func<TKey, T>): IOrderedEnumerable<T>;

    groupBy<TKey>(keySelector: Func<TKey, T>): IEnumerable<IGrouping<TKey, T>>;

    forEach(action: Action<T, number>): void;

    toArray(): T[];

    toCollection(): ICollection<T>;

    toReadOnlyCollection(): IReadOnlyCollection<T>;

    toHashSet(): IHashSet<T>;

    toReadOnlyHashSet(): IReadOnlyHashSet<T>;

    toDictionary<TKey, TValue>(keySelector: Func<TKey, T>, valueSelector: Func<TValue, T>): IDictionary<TKey, TValue>;

    toReadOnlyDictionary<TKey, TValue>(keySelector: Func<TKey, T>, valueSelector: Func<TValue, T>): IReadOnlyDictionary<TKey, TValue>;
}
