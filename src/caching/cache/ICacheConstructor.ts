import {Func} from "../../types/internal";
import {TimeSpan} from "../../time/internal";
import {IEqualityComparer, IKeyValuePair} from "../../collections/internal";
import {ICache} from "../internal";

export interface ICacheConstructor<TKey, TValue> {
    new(expirationPeriodFactory: Func<TimeSpan>,
        expirationCheckingPeriodFactory: Func<TimeSpan>,
        values?: IKeyValuePair<TKey, TValue>[],
        equalityComparer?: IEqualityComparer<TKey>): ICache<TKey, TValue>;
}
