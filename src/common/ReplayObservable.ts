import {IList, List} from "../collections/internal";
import {IDisposable, Observable, Observer} from "./internal";

export abstract class ReplayObservable<T> extends Observable<T> {
    private _values: IList<Readonly<T>>;

    protected constructor(private readonly _replayCount: number) {
        super();

        this._values = new List<T>();
    }

    public subscribe(observer: Observer<T>): IDisposable {
        const subscription = super.subscribe(observer);

        if (Observable.isValueObserver(observer)) {
            for (const value of this._values) {
                observer.onNext(value);
            }
        }

        return subscription;
    }

    protected next(value: Readonly<T>): void {
        super.next(value);

        this._values.add(value);
        if (this._values.length > this._replayCount) {
            this._values = this._values.skip(this._values.length - this._replayCount).toList();
        }
    }
}
