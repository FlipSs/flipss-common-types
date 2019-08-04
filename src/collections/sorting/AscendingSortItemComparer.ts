import {IComparer, SortItemComparer} from "../internal";
import {Func} from "../../types/internal";

export class AscendingSortItemComparer<TKey, TValue> extends SortItemComparer<TKey, TValue> {
    public constructor(keySelector: Func<TKey, TValue>,
                       comparer?: IComparer<TKey>) {
        super(keySelector, comparer);
    }

    protected compareKeys(comparer: IComparer<TKey>, leftKey: TKey, rightKey: TKey): number {
        return comparer.compare(leftKey, rightKey);
    }
}
