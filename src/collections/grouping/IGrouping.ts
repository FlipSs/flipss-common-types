import {IEnumerable} from "../internal";

export interface IGrouping<TKey, TValue> extends IEnumerable<TValue> {
    readonly key: TKey;
}
