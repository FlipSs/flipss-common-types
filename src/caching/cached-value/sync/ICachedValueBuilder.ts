import {ICachedValue} from "../../internal";
import {IValueStorage} from "../../../storages/internal";
import {Action} from "../../../types/internal";

export interface ICachedValueBuilder<T> {
    useLazy(): ICachedValueBuilder<T>;

    useSlidingExpiration(): ICachedValueBuilder<T>;

    saveValueToValueStorage(valueStorage: IValueStorage<T>): ICachedValueBuilder<T>;

    useValueStorageOnInit(valueStorage: IValueStorage<T>, minValueCreatedOn?: Date): ICachedValueBuilder<T>;

    useValueStorageOnFailure(valueStorage: IValueStorage<T>, minValueCreatedOn?: Date, onFailure?: Action<any>): ICachedValueBuilder<T>;

    useMemoryStorageOnFailure(onFailure?: Action<any>): ICachedValueBuilder<T>;

    create(): ICachedValue<T>;
}
