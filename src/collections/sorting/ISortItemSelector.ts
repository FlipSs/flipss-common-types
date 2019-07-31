import {SelectedSortItem} from "../internal";

export interface ISortItemSelector<T> {
    select(left: T, right: T): SelectedSortItem;
}
