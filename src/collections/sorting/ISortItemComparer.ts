export interface ISortItemComparer<T> {
    compare(left: T, right: T): number;
}
