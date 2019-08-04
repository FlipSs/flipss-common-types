import {DefaultComparer, IComparer, ISortItemComparer} from "../internal";
import {Func} from "../../types/internal";

export abstract class SortItemComparer<TKey, TValue> implements ISortItemComparer<TValue> {
    protected constructor(private readonly keySelector: Func<TKey, TValue>,
                          private readonly comparer?: IComparer<TKey>) {
        this.comparer = comparer || new DefaultComparer<TKey>();
    }

    public compare(left: TValue, right: TValue): number {
        const leftKey = this.keySelector(left);
        const rightKey = this.keySelector(right);

        return this.compareKeys(this.comparer, leftKey, rightKey);
    }

    protected abstract compareKeys(comparer: IComparer<TKey>, leftKey: TKey, rightKey: TKey): number;
}
