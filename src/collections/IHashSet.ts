import {ICollection, IEnumerable, IReadOnlyHashSet} from "./internal";

export interface IHashSet<T> extends ICollection<T>, IReadOnlyHashSet<T> {
    intersectWith(other: IEnumerable<T>): void;

    exceptWith(other: IEnumerable<T>): void;
}
