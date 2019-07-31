import {IValueStorage} from "../../storages/internal";
import {Argument, TypeUtils} from "../../utils/internal";
import {Func} from "../../types/internal";
import {TimeSpan} from "../../time/internal";
import {toFactory} from "../../internal/internal";
import {AsyncCachedValueBuilder, CachedValueBuilder, IAsyncCachedValueBuilder, ICachedValueBuilder} from "../internal";

export function getValueFromStorageOrDefault<T>(valueStorage: IValueStorage<T>, minValueCreatedOn?: Date): T | null {
    const storageValue = valueStorage.get();
    if (!TypeUtils.isNullOrUndefined(storageValue)) {
        if (TypeUtils.isNullOrUndefined(minValueCreatedOn) || storageValue.createdOn >= minValueCreatedOn) {
            return storageValue.value;
        }
    }

    return null;
}

export function buildCachedValue<T>(valueFactory: Func<T>, expirationPeriod: TimeSpan | Func<TimeSpan>): ICachedValueBuilder<T> {
    Argument.isNotNullOrUndefined(valueFactory, 'valueFactory');

    return new CachedValueBuilder(valueFactory, getExpirationPeriodFactory(expirationPeriod));
}

export function buildAsyncCachedValue<T>(valueFactory: Func<Promise<T>>, expirationPeriod: TimeSpan | Func<TimeSpan>): IAsyncCachedValueBuilder<T> {
    Argument.isNotNullOrUndefined(valueFactory, 'valueFactory');

    return new AsyncCachedValueBuilder(valueFactory, getExpirationPeriodFactory(expirationPeriod));
}

function getExpirationPeriodFactory(expirationPeriod: TimeSpan | Func<TimeSpan>): Func<TimeSpan> {
    Argument.isNotNullOrUndefined(expirationPeriod, 'expirationPeriod');

    return toFactory(expirationPeriod, TimeSpan);
}
