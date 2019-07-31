import {ICachedValueProvider, IValueWrapper} from "../internal";
import {Func} from "../../types/internal";
import {TimeSpan} from "../../time/internal";

export interface ICachedValueProviderConstructor<T> {
    new(valueWrapper: IValueWrapper<T>, expirationPeriodFactory: Func<TimeSpan>): ICachedValueProvider<T>;
}
