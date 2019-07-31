import {Func} from "../../types/internal";
import {TimeSpan} from "../../time/internal";
import {IEnumerable, IKeyValuePair} from "../../collections/internal";
import {ICache} from "../internal";

export interface ICacheConstructor<TKey, TValue> {
    new(expirationPeriodFactory: Func<TimeSpan>,
        expirationCheckingPeriodFactory: Func<TimeSpan>,
        values?: IEnumerable<IKeyValuePair<TKey, TValue>>): ICache<TKey, TValue>;
}
