import {ICachedValueProvider, IValueFactoryWrapper} from "../internal";
import {Func} from "../../types/internal";
import {TimeSpan} from "../../time/internal";

export interface ICachedValueProviderConstructor<T> {
    new(valueWrapper: IValueFactoryWrapper<T>, expirationPeriodFactory: Func<TimeSpan>): ICachedValueProvider<T>;
}
