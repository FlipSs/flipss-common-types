import {IValueFactoryWrapper} from "../internal";
import {Func} from "../../types/internal";
import {TimeSpan} from "../../time/internal";

export interface IExpirationValueFactoryWrapperDecoratorConstructor<T> {
    new(valueWrapper: IValueFactoryWrapper<T>, expirationPeriodFactory: Func<TimeSpan>): IValueFactoryWrapper<T>;
}
