import {Func} from "../../types/internal";
import {IEnumerable} from "../internal";

export interface IOrderedEnumerable<T> extends IEnumerable<T> {
    thenBy<TKey>(keySelector: Func<TKey, T>): IOrderedEnumerable<T>;

    thenByDescending<TKey>(keySelector: Func<TKey, T>): IOrderedEnumerable<T>;
}
