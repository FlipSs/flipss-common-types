import {Func} from "../../types/internal";
import {IDisposable} from "../../common/internal";

export interface ICache<TKey, TValue> extends IDisposable {
    set(key: TKey, value: TValue): void;

    getOrAdd(key: TKey, valueFactory: Func<TValue, TKey>): TValue;

    containsKey(key: TKey): boolean;

    getValueOrDefault(key: TKey, defaultValue?: TValue): TValue | undefined;

    clear(): void;
}
