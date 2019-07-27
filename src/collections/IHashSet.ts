import {IEnumerable} from "./IEnumerable";
import {ICollection} from "./ICollection";
import {IReadOnlyHashSet} from "./IReadOnlyHashSet";

export interface IHashSet<T> extends ICollection<T>, IReadOnlyHashSet<T> {
    intersectWith(other: IEnumerable<T>): void;

    exceptWith(other: IEnumerable<T>): void;
}
