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
    private _expirationCheckingPeriodFactory!: Func<TimeSpan>;
    private _cacheConstructor!: ICacheConstructor<TKey, TValue>;
    private _predefinedValues: IKeyValuePair<TKey, TValue>[];
    private _equalityComparer: IEqualityComparer<TKey>;

    public constructor(private readonly _expirationPeriodFactory: Func<TimeSpan>) {
        this._expirationCheckingPeriodFactory = () => defaultExpirationCheckingPeriod;
        this._cacheConstructor = AbsoluteExpirationCache;
    }

    public create(): ICache<TKey, TValue> {
        return new this._cacheConstructor(this._expirationPeriodFactory, this._expirationCheckingPeriodFactory, this._predefinedValues, this._equalityComparer);
    }

    public setExpirationCheckingPeriod(expirationCheckingPeriod: TimeSpan | Func<TimeSpan>): ICacheBuilder<TKey, TValue> {
        Argument.isNotNullOrUndefined(expirationCheckingPeriod, 'expirationCheckingPeriod');

        this._expirationCheckingPeriodFactory = toFactory(TimeSpan, expirationCheckingPeriod);

        return this;
    }

    public setPredefinedValues(values: IKeyValuePair<TKey, TValue>[]): ICacheBuilder<TKey, TValue> {
        Argument.isNotNullOrEmpty(values, 'values');

        this._predefinedValues = values;

        return this;
    }

    public useSlidingExpiration(): ICacheBuilder<TKey, TValue> {
        this._cacheConstructor = SlidingExpirationCache;

        return this;
    }

    public setEqualityComparer(equalityComparer: IEqualityComparer<TKey>): ICacheBuilder<TKey, TValue> {
        Argument.isNotNullOrUndefined(equalityComparer, 'equalityComparer');

        this._equalityComparer = equalityComparer;

        return this;
    }
}
