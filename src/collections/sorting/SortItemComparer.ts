import {DefaultComparer, IComparer, IList, ISortItemComparer, List} from "../internal";
import {Func} from "../../types/internal";

export abstract class SortItemComparer<TKey, TValue> implements ISortItemComparer<TValue> {
    private readonly _keys: IList<TKey>;
    private readonly _comparer: IComparer<TKey>;

    protected constructor(private readonly _keySelector: Func<TKey, TValue>,
                          comparer?: IComparer<TKey>) {
        this._keys = new List<TKey>();
        this._comparer = comparer || new DefaultComparer<TKey>();
    }

    public compare(left: number, right: number): number {
        return this.compareKeys(this._comparer, this._keys[left], this._keys[right]);
    }

    public initialize(values: TValue[]): void {
        this._keys.clear();

        for (const value of values) {
            this._keys.add(this._keySelector(value));
        }
    }

    protected abstract compareKeys(comparer: IComparer<TKey>, leftKey: TKey, rightKey: TKey): number;
}
