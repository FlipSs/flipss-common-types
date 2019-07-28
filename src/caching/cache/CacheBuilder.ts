import {TimeSpan} from "../../time";
import {Func} from "../../types";
import {ICacheConstructor} from "./ICacheConstructor";
import {IKeyValuePair, IReadOnlyCollection} from "../../collections";
import {AbsoluteExpirationCache} from "./AbsoluteExpirationCache";
import {ICache} from "./ICache";
import {Argument} from "../../utils";
import {toFactory} from "../../internal/functions";
import {SlidingExpirationCache} from "./SlidingExpirationCache";
import {ICacheBuilder} from "./ICacheBuilder";

const defaultExpirationCheckingPeriod = TimeSpan.fromSeconds(30);

export class CacheBuilder<TKey, TValue> implements ICacheBuilder<TKey, TValue> {
    private expirationCheckingPeriodFactory: Func<TimeSpan>;
    private cacheConstructor: ICacheConstructor<TKey, TValue>;
    private predefinedValues: IReadOnlyCollection<IKeyValuePair<TKey, TValue>>;

    public constructor(private readonly expirationPeriodFactory: Func<TimeSpan>) {
        this.expirationCheckingPeriodFactory = () => defaultExpirationCheckingPeriod;
        this.cacheConstructor = AbsoluteExpirationCache;
    }

    public create(): ICache<TKey, TValue> {
        return new this.cacheConstructor(this.expirationPeriodFactory, this.expirationCheckingPeriodFactory, this.predefinedValues);
    }

    public setExpirationCheckingPeriod(expirationCheckingPeriod: TimeSpan | Func<TimeSpan>): ICacheBuilder<TKey, TValue> {
        Argument.isNotNullOrUndefined(expirationCheckingPeriod, 'expirationCheckingPeriod');

        this.expirationCheckingPeriodFactory = toFactory(expirationCheckingPeriod, TimeSpan);

        return this;
    }

    public setPredefinedValues(values: IReadOnlyCollection<IKeyValuePair<TKey, TValue>>): ICacheBuilder<TKey, TValue> {
        Argument.isNotNullOrEmpty(values, 'values');

        this.predefinedValues = values;

        return this;
    }

    public useSlidingExpiration() {
        this.cacheConstructor = SlidingExpirationCache;
    }
}
