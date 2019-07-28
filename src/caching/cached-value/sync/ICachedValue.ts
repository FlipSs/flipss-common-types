import {IDisposable} from "../../../models";

export interface ICachedValue<T> extends IDisposable {
    getValue(): T;
}
