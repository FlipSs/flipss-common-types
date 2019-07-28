import {IStorageValue} from "./IStorageValue";

export interface IValueStorage<T> {
    clear(): void;

    save(value: T): void;

    load(): IStorageValue<T> | null;
}
