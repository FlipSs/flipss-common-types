import {IKeyValuePair, IReadOnlyCollection} from "../../collections";
import {TimeSpan} from "../../time";
import {Func} from "../../types";
import {ICache} from "./ICache";

export interface ICacheBuilder<TKey, TValue> {
    setPredefinedValues(values: IReadOnlyCollection<IKeyValuePair<TKey, TValue>>): ICacheBuilder<TKey, TValue>;

    setExpirationCheckingPeriod(expirationCheckingPeriod: TimeSpan | Func<TimeSpan>): ICacheBuilder<TKey, TValue>;

    useSlidingExpiration();

    create(): ICache<TKey, TValue>;
}
