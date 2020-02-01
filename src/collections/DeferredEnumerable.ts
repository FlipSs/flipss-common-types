import {Func} from "../types/internal";
import {Enumerable} from "./internal";

export class DeferredEnumerable<T> extends Enumerable<T> {
    public constructor(private readonly _valueFactory: Func<T[]>) {
        super();
    }

    protected getValue(): T[] {
        return this._valueFactory();
    }
}
