import {Func} from "../types";
import {IValueWrapper} from "./sync/IValueWrapper";

export interface IValueWrapperConstructor<T> {
    new(valueFactory: Func<T>): IValueWrapper<T>;
}
