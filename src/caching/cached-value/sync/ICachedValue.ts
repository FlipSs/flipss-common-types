import {IDisposable, IObservable} from "../../../common/internal";

export interface ICachedValue<T> extends IDisposable, IObservable {
    getValue(): T;

    reset(): void;
}
