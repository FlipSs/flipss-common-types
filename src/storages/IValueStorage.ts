import {IStorageValue} from "./internal";

export interface IValueStorage<T> {
    clear(): void;

    set(value: T): void;

    get(): IStorageValue<T> | null;
}
