import {Collection, ICollection} from "../collections/internal";
import {Action} from "../types/internal";
import {Argument} from "../utils/internal";
import {IObservable} from "./internal";

export abstract class Observable<T> implements IObservable<T> {
    private readonly subscribers: ICollection<Action<Readonly<T>>>;

    protected constructor() {
        this.subscribers = new Collection<Action<Readonly<T>>>();
    }

    public subscribe(action: Action<Readonly<T>>): void {
        Argument.isNotNullOrUndefined(action, 'action');

        this.subscribers.add(action);
    }

    public unsubscribe(action: Action<Readonly<T>>): void {
        Argument.isNotNullOrUndefined(action, 'action');

        if (!this.subscribers.tryRemove(action)) {
            throw new Error('Subscriber not found');
        }
    }

    protected nextValue(value: Readonly<T>): void {
        for (const subscriber of this.subscribers) {
            subscriber(value);
        }
    }
}
