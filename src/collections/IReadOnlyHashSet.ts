import {IReadOnlyCollection} from "./internal";

export interface IReadOnlyHashSet<T> extends IReadOnlyCollection<T> {
    has(item: T): boolean;
}
