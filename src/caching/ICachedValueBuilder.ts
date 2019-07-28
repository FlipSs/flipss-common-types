import {ICachedValue} from "./sync/ICachedValue";
import {Func} from "../types";
import {TimeSpan} from "../time";
import {Argument, TypeUtils} from "../utils";
import {CachedValueBuilder} from "./sync/CachedValueBuilder";

export interface ICachedValueBuilder<T> {
    useLazy(): ICachedValueBuilder<T>;

    useSlidingExpiration(): ICachedValueBuilder<T>;

    useLocalStorageOnInit(): ICachedValueBuilder<T>;

    useLocalStorageOnInitAndFailure(): ICachedValueBuilder<T>;

    create(): ICachedValue<T>;
}

export function buildCachedValue<T>(valueFactory: Func<T>, expirationPeriod: TimeSpan | Func<TimeSpan>): ICachedValueBuilder<T> {
    Argument.isNotNullOrUndefined(valueFactory, 'valueFactory');
    Argument.isNotNullOrUndefined(expirationPeriod, 'expirationPeriod');

    const expirationPeriodFactory = TypeUtils.is(expirationPeriod, TimeSpan)
        ? () => expirationPeriod
        : expirationPeriod;

    return new CachedValueBuilder(valueFactory, expirationPeriodFactory);
}
