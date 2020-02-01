import {Enumerable} from "./internal";

export class IterableAsEnumerable<T> extends Enumerable<T> {
    public constructor(private readonly _values: Iterable<T>) {
        super();
    }

    protected getValues(): Iterable<T> {
        return this._values;
    }
}
