import {IReadOnlyList} from "./internal";

export interface IList<T> extends IReadOnlyList<T> {
    add(value: T): void;

    addRange(values: Iterable<T>): void

    tryRemove(value: T): boolean;

    clear(): ReadonlyArray<T>;
}
