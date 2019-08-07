import {IReadOnlyList} from "./internal";

export interface IList<T> extends IReadOnlyList<T> {
    add(value: T): void;

    tryRemove(value: T): boolean;

    clear(): void;
}
