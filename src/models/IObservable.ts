import {IDisposable, Observer} from "./internal";

export interface IObservable<T> {
    subscribe(observer: Observer<T>): IDisposable;
}
