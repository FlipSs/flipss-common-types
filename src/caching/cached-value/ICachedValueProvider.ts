import {IDisposable} from "../../models/internal";

export interface ICachedValueProvider<T> extends IDisposable {
    getValue(): T;
}
