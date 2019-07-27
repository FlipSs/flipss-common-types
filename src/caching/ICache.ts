import {Func} from "../types";

export interface ICache<TKey, TValue> {
    getOrAdd(key: TKey, valueFactory: Func<TValue, TKey>);

    contains(key: TKey): boolean;

    set(key: TKey, value: TValue): void;

    get(key: TKey): TValue | null;

    tryAdd(key: TKey, value: TValue): boolean;

    tryRemove(key: TKey): boolean;
}
