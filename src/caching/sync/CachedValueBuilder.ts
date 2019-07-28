import {ICachedValueBuilder} from "../ICachedValueBuilder";
import {IValueWrapperConstructor} from "../IValueWrapperConstructor";
import {ICachedValueConstructor} from "../ICachedValueConstructor";
import {Func} from "../../types";
import {TimeSpan} from "../../time";
import {InstantValueWrapper} from "./InstantValueWrapper";
import {AbsoluteExpirationCachedValue} from "./AbsoluteExpirationCachedValue";
import {LazyValueWrapper} from "./LazyValueWrapper";
import {SlidingExpirationCachedValue} from "./SlidingExpirationCachedValue";
import {ICachedValue} from "./ICachedValue";

export class CachedValueBuilder<T> implements ICachedValueBuilder<T> {
    private valueWrapperConstructor: IValueWrapperConstructor<T>;
    private cachedValueConstructor: ICachedValueConstructor<T>;

    public constructor(private readonly valueFactory: Func<T>,
                       private readonly expirationPeriodFactory: Func<TimeSpan>) {
        this.valueWrapperConstructor = InstantValueWrapper;
        this.cachedValueConstructor = AbsoluteExpirationCachedValue;
    }

    public create(): ICachedValue<T> {
        const valueWrapper = new this.valueWrapperConstructor(this.valueFactory);

        return new this.cachedValueConstructor(valueWrapper, this.expirationPeriodFactory);
    }

    public useLazy(): ICachedValueBuilder<T> {
        this.valueWrapperConstructor = LazyValueWrapper;

        return this;
    }

    public useSlidingExpiration(): ICachedValueBuilder<T> {
        this.cachedValueConstructor = SlidingExpirationCachedValue;

        return this;
    }
}
