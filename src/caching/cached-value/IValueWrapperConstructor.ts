import {IValueFactory, IValueWrapper} from "../internal";

export interface IValueWrapperConstructor<T> {
    new(valueFactory: IValueFactory<T>): IValueWrapper<T>;
}
