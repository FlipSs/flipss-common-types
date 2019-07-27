import {Func} from "../types";
import {Enumerable} from "./Enumerable";

export class DeferredEnumerable<T> extends Enumerable<T> {
    public constructor(private readonly valueFactory: Func<T[]>) {
        super();
    }

    protected getValue(): T[] {
        return this.valueFactory();
    }
}
