import {IReadOnlyCollection} from "./internal";

export interface ICollection<T> extends IReadOnlyCollection<T> {
    add(item: T): void;

    tryRemove(item: T): boolean;

    clear(): void;
}
