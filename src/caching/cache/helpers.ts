import {Func} from "../../types/internal";
import {TimeSpan} from "../../time/internal";
import {CacheBuilder, ICacheBuilder} from "../internal";
import {Argument} from "../../utils/internal";
import {toFactory} from "../../internal/internal";

export function buildCache<TKey, TValue>(expirationPeriod: TimeSpan | Func<TimeSpan>): ICacheBuilder<TKey, TValue> {
    Argument.isNotNullOrUndefined(expirationPeriod, 'expirationPeriod');

    return new CacheBuilder(toFactory(expirationPeriod, TimeSpan));
}
