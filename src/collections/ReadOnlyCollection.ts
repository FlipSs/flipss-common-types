import {Enumerable, IReadOnlyCollection} from "./internal";

export abstract class ReadOnlyCollection<T> extends Enumerable<T> implements IReadOnlyCollection<T> {
    public get isEmpty(): boolean {
        return this.length === 0;
    }

    public get length(): number {
        return this.getArray().length;
    }

    public abstract getArray(): T[];

    protected getValues(): Iterable<T> {
        return this.getArray();
    }
}

