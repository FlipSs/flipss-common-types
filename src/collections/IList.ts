import {IReadOnlyList} from "./internal";

export interface IList<T> extends IReadOnlyList<T> {
    add(item: T): void;

    tryRemove(item: T): boolean;

    clear(): void;
}
