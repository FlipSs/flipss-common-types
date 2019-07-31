import {IDisposable} from "../../../models/internal";

export interface ICachedValue<T> extends IDisposable {
    getValue(): T;
}
