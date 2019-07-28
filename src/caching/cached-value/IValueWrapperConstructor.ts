import {IValueWrapper} from "./IValueWrapper";
import {IValueFactory} from "./IValueFactory";

export interface IValueWrapperConstructor<T> {
    new(valueFactory: IValueFactory<T>): IValueWrapper<T>;
}
