import {Func} from "../../types/internal";
import {IComparer, IEnumerable} from "../internal";

export interface IOrderedEnumerable<T> extends IEnumerable<T> {
    thenBy<TKey>(keySelector: Func<TKey, T>, comparer?: IComparer<TKey>): IOrderedEnumerable<T>;

    thenByDescending<TKey>(keySelector: Func<TKey, T>, comparer?: IComparer<TKey>): IOrderedEnumerable<T>;
}
