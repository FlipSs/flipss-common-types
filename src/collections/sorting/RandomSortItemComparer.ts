import {ISortItemComparer} from "./ISortItemComparer";

export class RandomSortItemComparer<TValue> implements ISortItemComparer<TValue> {
    public compare(left: number, right: number): number {
        return Math.random();
    }

    public initialize(elements: TValue[]): void {
    }
}
