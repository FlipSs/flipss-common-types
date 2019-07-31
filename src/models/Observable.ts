import {HashSet, IHashSet} from "../collections/internal";
import {Action} from "../types/internal";
import {Argument, TypeUtils} from "../utils/internal";
import {IDisposable, IErrorObserver, IObservable, IValueObserver, Observer} from "./internal";

export abstract class Observable<T> implements IObservable<T>, IDisposable {
    private readonly observers: IHashSet<Observer<T>>;

    protected constructor() {
        this.observers = new HashSet<IValueObserver<Readonly<T>>>();
    }

    protected static isValueObserver<T>(observer: Observer<T>): observer is IValueObserver<T> {
        return !TypeUtils.isNullOrUndefined((observer as IValueObserver<T>).onNext);
    }

    protected static isErrorObserver(observer: Observer<any>): observer is IErrorObserver {
        return !TypeUtils.isNullOrUndefined((observer as IErrorObserver).onError);
    }

    public subscribe(observer: Observer<T>): IDisposable {
        Argument.isNotNullOrUndefined(observer, 'observer');

        if (this.observers.has(observer)) {
            throw new Error('Observer already subscribed');
        }

        this.observers.add(observer);

        return new Subscription(() => this.unsubscribe(observer));
    }

    public dispose(): void {
        this.observers.clear();
    }

    protected next(value: Readonly<T>): void {
        for (const observer of this.observers) {
            if (Observable.isValueObserver(observer)) {
                observer.onNext(value);
            }
        }
    }

    protected error(error: Readonly<Error>): void {
        for (const observer of this.observers) {
            if (Observable.isErrorObserver(observer)) {
                observer.onError(error);
            }
        }
    }

    private unsubscribe(observer: Observer<T>): void {
        if (!this.observers.tryRemove(observer)) {
            throw new Error('Observer already unsubscribed');
        }
    }
}

class Subscription implements IDisposable {
    public constructor(private readonly unsubscribeAction: Action) {
    }

    public dispose(): void {
        this.unsubscribeAction();
    }
}
