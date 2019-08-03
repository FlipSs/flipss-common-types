import {TimeSpan} from "../../time/internal";
import {Func} from "../../types/internal";
import {AbsoluteExpirationCache, ICache, ICacheBuilder, ICacheConstructor, SlidingExpirationCache} from "../internal";
import {IKeyValuePair, IReadOnlyCollection} from "../../collections/internal";
import {Argument} from "../../utils/internal";
import {toFactory} from "../../common/internal";

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

        this.expirationCheckingPeriodFactory = toFactory(TimeSpan, expirationCheckingPeriod);

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
