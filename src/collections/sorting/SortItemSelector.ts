import {ISortItemSelector, SelectedSortItem} from "../internal";
import {Func} from "../../types/internal";

export abstract class SortItemSelector<TKey, TValue> implements ISortItemSelector<TValue> {
    protected constructor(private readonly keySelector: Func<TKey, TValue>) {
    }

    public select(left: TValue, right: TValue): SelectedSortItem {
        const leftKey = this.keySelector(left);
        const rightKey = this.keySelector(right);

        if (leftKey === rightKey) {
            return SelectedSortItem.none;
        }

        return this.selectFromNotEqualKeys(leftKey, rightKey);
    }

    protected abstract selectFromNotEqualKeys(leftKey: TKey, rightKey: TKey): SelectedSortItem;
}
