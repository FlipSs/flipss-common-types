import {IEnumerable} from "./internal";

export interface IReadOnlyCollection<T> extends IEnumerable<T> {
    readonly length: number;

    readonly isEmpty: boolean;
}

