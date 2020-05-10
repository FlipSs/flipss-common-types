import {IValueStorage} from "../../../storages/internal";
import {Action} from "../../../types/internal";
import {IAsyncCachedValue} from "../../internal";

export interface IAsyncCachedValueBuilder<T> {
    useLazy(): IAsyncCachedValueBuilder<T>;

    useSlidingExpiration(): IAsyncCachedValueBuilder<T>;

    saveValueToValueStorage(valueStorage: IValueStorage<T>): IAsyncCachedValueBuilder<T>;

    useValueStorageOnInit(valueStorage: IValueStorage<T>, minValueCreatedOn?: Date): IAsyncCachedValueBuilder<T>;

    useValueStorageOnFailure(valueStorage: IValueStorage<T>, minValueCreatedOn?: Date, onFailure?: Action<any>): IAsyncCachedValueBuilder<T>;

    useMemoryStorageOnFailure(onFailure?: Action<any>): IAsyncCachedValueBuilder<T>;

    create(): IAsyncCachedValue<T>;
}

