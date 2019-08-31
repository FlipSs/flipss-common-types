import {TimeSpan} from "../../time/internal";
import {Func} from "../../types/internal";
import {AbsoluteExpirationCache, ICache, ICacheBuilder, ICacheConstructor, SlidingExpirationCache} from "../internal";
import {IEqualityComparer, IKeyValuePair} from "../../collections/internal";
import {Argument} from "../../utils/internal";
import {toFactory} from "../../common/internal";

const defaultExpirationCheckingPeriod = TimeSpan.fromSeconds(30);

export function buildCache<TKey, TValue>(expirationPeriod: TimeSpan | Func<TimeSpan>): ICacheBuilder<TKey, TValue> {
    Argument.isNotNullOrUndefined(expirationPeriod, 'expirationPeriod');

    return new CacheBuilder(toFactory(TimeSpan, expirationPeriod));
}

export class CacheBuilder<TKey, TValue> implements ICacheBuilder<TKey, TValue> {
    private expirationCheckingPeriodFactory: Func<TimeSpan>;
    private cacheConstructor: ICacheConstructor<TKey, TValue>;
    private predefinedValues: IKeyValuePair<TKey, TValue>[];
    private equalityComparer: IEqualityComparer<TKey>;

    public constructor(private readonly expirationPeriodFactory: Func<TimeSpan>) {
        this.expirationCheckingPeriodFactory = () => defaultExpirationCheckingPeriod;
        this.cacheConstructor = AbsoluteExpirationCache;
    }

    public create(): ICache<TKey, TValue> {
        return new this.cacheConstructor(this.expirationPeriodFactory, this.expirationCheckingPeriodFactory, this.predefinedValues, this.equalityComparer);
    }

    public setExpirationCheckingPeriod(expirationCheckingPeriod: TimeSpan | Func<TimeSpan>): ICacheBuilder<TKey, TValue> {
        Argument.isNotNullOrUndefined(expirationCheckingPeriod, 'expirationCheckingPeriod');

        this.expirationCheckingPeriodFactory = toFactory(TimeSpan, expirationCheckingPeriod);

        return this;
    }

    public setPredefinedValues(values: IKeyValuePair<TKey, TValue>[]): ICacheBuilder<TKey, TValue> {
        Argument.isNotNullOrEmpty(values, 'values');

        this.predefinedValues = values;

        return this;
    }

    public useSlidingExpiration(): ICacheBuilder<TKey, TValue> {
        this.cacheConstructor = SlidingExpirationCache;

        return this;
    }

    public setEqualityComparer(equalityComparer: IEqualityComparer<TKey>): ICacheBuilder<TKey, TValue> {
        Argument.isNotNullOrUndefined(equalityComparer, 'equalityComparer');

        this.equalityComparer = equalityComparer;

        return this;
    }
}
