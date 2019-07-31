import {Collection, ICollection} from "../collections/internal";
import {IDisposable, Observable, Observer} from "./internal";

export abstract class ReplayObservable<T> extends Observable<T> {
    private values: ICollection<Readonly<T>>;

    protected constructor(private readonly replayCount: number) {
        super();

        this.values = new Collection<T>();
    }

    public subscribe(observer: Observer<T>): IDisposable {
        const subscription = super.subscribe(observer);

        if (Observable.isValueObserver(observer)) {
            for (const value of this.values) {
                observer.onNext(value);
            }
        }

        return subscription;
    }

    protected next(value: Readonly<T>): void {
        super.next(value);

        this.values.add(value);
        if (this.values.length > this.replayCount) {
            this.values = this.values.skip(this.values.length - this.replayCount).toCollection();
        }
    }
}
