import {IKeyValuePair, IReadOnlyCollection} from "../../collections/internal";
import {TimeSpan} from "../../time/internal";
import {Func} from "../../types/internal";
import {ICache} from "../internal";

export interface ICacheBuilder<TKey, TValue> {
    setPredefinedValues(values: IReadOnlyCollection<IKeyValuePair<TKey, TValue>>): ICacheBuilder<TKey, TValue>;

    setExpirationCheckingPeriod(expirationCheckingPeriod: TimeSpan | Func<TimeSpan>): ICacheBuilder<TKey, TValue>;

    useSlidingExpiration();

    create(): ICache<TKey, TValue>;
}
