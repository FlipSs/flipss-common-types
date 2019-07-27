import {IKeyValuePair} from "./IKeyValuePair";
import {IReadOnlyCollection} from "./IReadOnlyCollection";

export interface IReadOnlyDictionary<TKey, TValue> extends IReadOnlyCollection<IKeyValuePair<TKey, TValue>> {
    readonly values: IReadOnlyCollection<TValue>;
    readonly keys: IReadOnlyCollection<TKey>;

    containsKey(key: TKey): boolean;

    getValueOrDefault(key: TKey, defaultValue?: TValue): TValue;
}
