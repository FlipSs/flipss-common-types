import {Enumerable} from "./Enumerable";
import {IReadOnlyCollection} from "./IReadOnlyCollection";

export abstract class ReadOnlyCollection<T> extends Enumerable<T> implements IReadOnlyCollection<T> {
    public get isEmpty(): boolean {
        return this.length === 0;
    }

    public abstract get length(): number;
}
