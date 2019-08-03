import {IDisposable} from "../../common/internal";

export interface ICachedValueProvider<T> extends IDisposable {
    getValue(): T;
}
