import {IReadOnlyCollection} from "./IReadOnlyCollection";

export interface IReadOnlyList<T> extends IReadOnlyCollection<T> {
    get(index: number): T;
}
