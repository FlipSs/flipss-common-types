export interface IComparer<T> {
    compare(obj1: T, obj2: T): number;
}
