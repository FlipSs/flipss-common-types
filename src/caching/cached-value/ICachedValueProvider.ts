import {IDisposable} from "../../models";

export interface ICachedValueProvider<T> extends IDisposable {
    getValue(): T;
}
