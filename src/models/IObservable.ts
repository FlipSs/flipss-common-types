import {Action} from "../types";

export interface IObservable<T> {
    subscribe(action: Action<Readonly<T>>): void;

    unsubscribe(action: Action<Readonly<T>>): void;
}
