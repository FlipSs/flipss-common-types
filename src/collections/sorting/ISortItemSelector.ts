import {SelectedSortItem} from "./SelectedSortItem";

export interface ISortItemSelector<T> {
    select(left: T, right: T): SelectedSortItem;
}
