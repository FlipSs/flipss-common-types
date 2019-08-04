import {IEnumerable, IReadOnlyHashSet} from "./internal";

export interface IHashSet<T> extends IReadOnlyHashSet<T> {
    intersectWith(other: IEnumerable<T>): void;

    exceptWith(other: IEnumerable<T>): void;

    tryAdd(item: T): boolean;

    tryRemove(item: T): boolean;

    clear(): void;
}
