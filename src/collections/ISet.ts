import {IEnumerable, IReadOnlySet} from "./internal";

export interface ISet<T> extends IReadOnlySet<T> {
    intersectWith(other: IEnumerable<T>): void;

    exceptWith(other: IEnumerable<T>): void;

    tryAdd(item: T): boolean;

    tryRemove(item: T): boolean;

    clear(): void;
}
