import {Func} from "../types";
import {IReadOnlyDictionary} from "./IReadOnlyDictionary";

export interface IDictionary<TKey, TValue> extends IReadOnlyDictionary<TKey, TValue> {
    tryRemove(key: TKey): boolean;

    tryAdd(key: TKey, value: TValue): boolean;

    set(key: TKey, value: TValue): void;

    getOrAdd(key: TKey, valueFactory: Func<TValue, TKey>): TValue;

    clear(): void;
}
