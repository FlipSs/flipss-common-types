import {IReadOnlyCollection} from "./IReadOnlyCollection";

export interface IReadOnlyHashSet<T> extends IReadOnlyCollection<T> {
    has(value: T): boolean;
}
