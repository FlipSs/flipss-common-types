import {IStorageValue} from "./IStorageValue";

export interface IValueStorage<T> {
    clear(): void;

    set(value: T): void;

    get(): IStorageValue<T> | null;
}
