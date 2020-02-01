import {DefaultComparer, IComparer, ISortItemComparer} from "../internal";
import {Func} from "../../types/internal";

export abstract class SortItemComparer<TKey, TValue> implements ISortItemComparer<TValue> {
    protected constructor(private readonly _keySelector: Func<TKey, TValue>,
                          private readonly _comparer?: IComparer<TKey>) {
        this._comparer = _comparer || new DefaultComparer<TKey>();
    }

    public compare(left: TValue, right: TValue): number {
        const leftKey = this._keySelector(left);
        const rightKey = this._keySelector(right);

        return this.compareKeys(this._comparer, leftKey, rightKey);
    }

    protected abstract compareKeys(comparer: IComparer<TKey>, leftKey: TKey, rightKey: TKey): number;
}
