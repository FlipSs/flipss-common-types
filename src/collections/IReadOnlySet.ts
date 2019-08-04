import {IReadOnlyCollection} from "./internal";

export interface IReadOnlySet<T> extends IReadOnlyCollection<T> {
    has(item: T): boolean;
}
