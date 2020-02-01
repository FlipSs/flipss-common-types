export interface ISortItemComparer<T> {
    initialize(values: T[]): void;

    compare(left: number, right: number): number;
}
