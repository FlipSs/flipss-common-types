import {Func} from "../../types/internal";
import {IDisposable} from "../../common/internal";

export interface ICache<TKey, TValue> extends IDisposable {
    set(key: TKey, value: TValue): void;

    getOrAdd(key: TKey, valueFactory: Func<TValue, TKey>): TValue;

    getOrAddAsync(key: TKey, asyncValueFactory: Func<Promise<TValue>, TKey>): Promise<TValue>;

    get(key: TKey): TValue;

    containsKey(key: TKey): boolean;

    getOrDefault(key: TKey, defaultValue?: TValue): TValue | undefined;

    tryRemove(key: TKey): boolean;

    clear(): void;
}
