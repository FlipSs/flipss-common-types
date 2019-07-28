import {IValueStorage} from "../../../storages/IValueStorage";
import {Action} from "../../../types";
import {IAsyncCachedValue} from "./IAsyncCachedValue";

export interface IAsyncCachedValueBuilder<T> {
    useLazy(): IAsyncCachedValueBuilder<T>;

    useSlidingExpiration(): IAsyncCachedValueBuilder<T>;

    saveValueToValueStorage(valueStorage: IValueStorage<T>): IAsyncCachedValueBuilder<T>;

    useValueStorageOnInit(valueStorage: IValueStorage<T>, minValueCreatedOn?: Date): IAsyncCachedValueBuilder<T>;

    useValueStorageOnFailure(valueStorage: IValueStorage<T>, minValueCreatedOn?: Date, onFailure?: Action<any>): IAsyncCachedValueBuilder<T>;

    create(): IAsyncCachedValue<T>;
}

