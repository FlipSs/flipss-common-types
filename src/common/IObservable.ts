import {IDisposable, Observer} from "./internal";

export interface IObservable<T = void> {
    subscribe(observer: Observer<T>): IDisposable;
}
