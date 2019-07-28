import {Func} from "../../types";
import {IDisposable} from "../../models";

export interface ICache<TKey, TValue> extends IDisposable {
    set(key: TKey, value: TValue): void;

    getOrAdd(key: TKey, valueFactory: Func<TValue, TKey>): TValue;

    containsKey(key: TKey): boolean;

    getValueOrDefault(key: TKey, defaultValue?: TValue): TValue | undefined;

    clear(): void;
}
