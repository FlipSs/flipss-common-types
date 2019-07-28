import {ICachedValue} from "./ICachedValue";
import {IValueStorage} from "../../../storages/IValueStorage";
import {Action} from "../../../types";

export interface ICachedValueBuilder<T> {
    useLazy(): ICachedValueBuilder<T>;

    useSlidingExpiration(): ICachedValueBuilder<T>;

    saveValueToValueStorage(valueStorage: IValueStorage<T>): ICachedValueBuilder<T>;

    useValueStorageOnInit(valueStorage: IValueStorage<T>, minValueCreatedOn?: Date): ICachedValueBuilder<T>;

    useValueStorageOnFailure(valueStorage: IValueStorage<T>, minValueCreatedOn?: Date, onFailure?: Action<any>): ICachedValueBuilder<T>;

    create(): ICachedValue<T>;
}
