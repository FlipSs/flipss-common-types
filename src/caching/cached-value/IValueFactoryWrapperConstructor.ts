import {IValueFactory, IValueFactoryWrapper} from "../internal";

export interface IValueFactoryWrapperConstructor<T> {
    new(valueFactory: IValueFactory<T>): IValueFactoryWrapper<T>;
}
