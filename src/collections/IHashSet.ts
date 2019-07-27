import {IEnumerable} from "./IEnumerable";
import {ICollection} from "./ICollection";

export interface IHashSet<T> extends ICollection<T> {
    has(value: T): boolean;

    intersectWith(other: IEnumerable<T>): void;

    exceptWith(other: IEnumerable<T>): void;
}

