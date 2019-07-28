import {Func} from "../../types";
import {TimeSpan} from "../../time";
import {ICacheBuilder} from "./ICacheBuilder";
import {Argument} from "../../utils";
import {CacheBuilder} from "./CacheBuilder";
import {toFactory} from "../../internal/functions";

export function buildCache<TKey, TValue>(expirationPeriod: TimeSpan | Func<TimeSpan>): ICacheBuilder<TKey, TValue> {
    Argument.isNotNullOrUndefined(expirationPeriod, 'expirationPeriod');

    return new CacheBuilder(toFactory(expirationPeriod, TimeSpan));
}
