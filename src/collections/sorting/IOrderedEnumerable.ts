import {Func} from "../../types";
import {IEnumerable} from "../IEnumerable";

export interface IOrderedEnumerable<T> extends IEnumerable<T> {
    thenBy<TKey>(keySelector: Func<TKey, T>): IOrderedEnumerable<T>;

    thenByDescending<TKey>(keySelector: Func<TKey, T>): IOrderedEnumerable<T>;
}
