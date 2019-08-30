import {IReadOnlySet} from "./internal";

export interface ISet<T> extends IReadOnlySet<T> {
    intersectWith(other: Iterable<T>): void;

    exceptWith(other: Iterable<T>): void;

    tryAdd(item: T): boolean;

    tryRemove(item: T): boolean;

    clear(): void;
}
