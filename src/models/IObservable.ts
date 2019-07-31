import {Action} from "../types/internal";

export interface IObservable<T> {
    subscribe(action: Action<Readonly<T>>): void;

    unsubscribe(action: Action<Readonly<T>>): void;
}
