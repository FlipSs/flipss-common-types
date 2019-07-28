import {IValueWrapper} from "./sync/IValueWrapper";
import {Func} from "../types";
import {TimeSpan} from "../time";
import {ICachedValue} from "./sync/ICachedValue";

export interface ICachedValueConstructor<T> {
    new(valueWrapper: IValueWrapper<T>, expirationPeriodFactory: Func<TimeSpan>): ICachedValue<T>;
}
