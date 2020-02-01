import {IEnumerable, IReadOnlyCollection} from "../internal";

export interface IGrouping<TKey, TValue> extends IEnumerable<TValue> {
    readonly key: TKey;
    readonly values: IReadOnlyCollection<TValue>;
}
