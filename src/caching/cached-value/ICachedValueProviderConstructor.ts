import {IValueWrapper} from "./IValueWrapper";
import {Func} from "../../types";
import {TimeSpan} from "../../time";
import {ICachedValueProvider} from "./ICachedValueProvider";

export interface ICachedValueProviderConstructor<T> {
    new(valueWrapper: IValueWrapper<T>, expirationPeriodFactory: Func<TimeSpan>): ICachedValueProvider<T>;
}
