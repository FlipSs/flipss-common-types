import {IEnumerable} from "./IEnumerable";

export interface IReadOnlyCollection<T> extends IEnumerable<T> {
    readonly length: number;
}

