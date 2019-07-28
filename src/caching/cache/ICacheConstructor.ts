import {Func} from "../../types";
import {TimeSpan} from "../../time";
import {IEnumerable, IKeyValuePair} from "../../collections";
import {ICache} from "./ICache";

export interface ICacheConstructor<TKey, TValue> {
    new(expirationPeriodFactory: Func<TimeSpan>,
        expirationCheckingPeriodFactory: Func<TimeSpan>,
        values?: IEnumerable<IKeyValuePair<TKey, TValue>>): ICache<TKey, TValue>;
}
