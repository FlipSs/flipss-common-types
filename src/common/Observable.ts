import {ISet, Set} from "../collections/internal";
import {Action} from "../types/internal";
import {Argument, TypeUtils} from "../utils/internal";
import {IDisposable, IErrorObserver, IObservable, IValueObserver, Observer} from "./internal";

export abstract class Observable<T = void> implements IObservable<T>, IDisposable {
    private readonly _observers: ISet<Observer<T>>;

    protected constructor() {
        this._observers = new Set<IValueObserver<Readonly<T>>>();
    }

    protected static isValueObserver<T>(observer: Observer<T>): observer is IValueObserver<T> {
        return TypeUtils.isFunction((observer as IValueObserver<T>).onNext);
    }

    protected static isErrorObserver(observer: Observer<any>): observer is IErrorObserver {
        return TypeUtils.isFunction((observer as IErrorObserver).onError);
    }

    public subscribe(observer: Observer<T>): IDisposable {
        Argument.isNotNullOrUndefined(observer, 'observer');

        if (!this._observers.tryAdd(observer)) {
            throw new Error('Observer already subscribed');
        }

        return new Subscription(() => this.unsubscribe(observer));
    }

    public dispose(): void {
        this._observers.clear();
    }

    protected next(value: Readonly<T>): void {
        for (const observer of this._observers) {
            if (Observable.isValueObserver(observer)) {
                observer.onNext(value);
            }
        }
    }

    protected error(error: Readonly<Error>): void {
        for (const observer of this._observers) {
            if (Observable.isErrorObserver(observer)) {
                observer.onError(error);
            }
        }
    }

    private unsubscribe(observer: Observer<T>): void {
        if (!this._observers.tryRemove(observer)) {
            throw new Error('Observer already unsubscribed');
        }
    }
}

class Subscription implements IDisposable {
    public constructor(private readonly _unsubscribeAction: Action) {
    }

    public dispose(): void {
        this._unsubscribeAction();
    }
}
