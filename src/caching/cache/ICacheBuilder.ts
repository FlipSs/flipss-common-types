import {IEqualityComparer, IKeyValuePair} from "../../collections/internal";
import {TimeSpan} from "../../time/internal";
import {Func} from "../../types/internal";
import {ICache} from "../internal";

export interface ICacheBuilder<TKey, TValue> {
    setPredefinedValues(values: IKeyValuePair<TKey, TValue>[]): ICacheBuilder<TKey, TValue>;

    setExpirationCheckingPeriod(expirationCheckingPeriod: TimeSpan | Func<TimeSpan>): ICacheBuilder<TKey, TValue>;

    useSlidingExpiration(): ICacheBuilder<TKey, TValue>;

    setEqualityComparer(equalityComparer: IEqualityComparer<TKey>): ICacheBuilder<TKey, TValue>;

    create(): ICache<TKey, TValue>;
}
