import {Collection, ICollection} from "../collections";
import {Action} from "../types";
import {Observable} from "./Observable";

export abstract class ReplayObservable<T> extends Observable<T> {
    private values: ICollection<Readonly<T>>;

    protected constructor(private readonly storeCount: number) {
        super();

        this.values = new Collection<T>();
    }

    public subscribe(action: Action<Readonly<T>>): void {
        super.subscribe(action);

        for (const value of this.values) {
            action(value);
        }
    }

    protected nextValue(value: Readonly<T>): void {
        super.nextValue(value);

        this.values = this.values.take(this.storeCount - 1).toCollection();
        this.values.add(value);
    }
}
