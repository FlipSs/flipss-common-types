import {IKeyValuePair, IReadOnlyCollection} from "./internal";

export interface IReadOnlyDictionary<TKey, TValue> extends IReadOnlyCollection<IKeyValuePair<TKey, TValue>> {
    readonly values: ReadonlyArray<TValue>;
    readonly keys: ReadonlyArray<TKey>;

    containsKey(key: TKey): boolean;

    getOrDefault(key: TKey, defaultValue?: TValue): TValue | undefined;

    get(key: TKey): TValue;
}
