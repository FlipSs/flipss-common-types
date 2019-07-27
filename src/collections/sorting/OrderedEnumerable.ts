import {Func} from "../../types";
import {SelectedSortItem} from "./SelectedSortItem";
import {Argument, TypeUtils} from "../../utils";
import {IOrderedEnumerable} from "./IOrderedEnumerable";
import {DeferredEnumerable} from "../DeferredEnumerable";
import {ISortItemSelector} from "./ISortItemSelector";
import {AscendingSortItemSelector} from "./AscendingSortItemSelector";
import {DescendingSortItemSelector} from "./DescendingSortItemSelector";

export class OrderedEnumerable<T> extends DeferredEnumerable<T> implements IOrderedEnumerable<T> {
    private readonly selectors: ISortItemSelector<T>[];

    public constructor(valueFactory: Func<T[]>,
                       ...selectors: ISortItemSelector<T>[]) {
        super(valueFactory);

        this.selectors = selectors;
    }

    public thenBy<TKey>(keySelector: Func<TKey, T>): IOrderedEnumerable<T> {
        Argument.isNotNullOrUndefined(keySelector, 'keySelector');

        const newSelector = new AscendingSortItemSelector(keySelector);

        return new OrderedEnumerable(super.getValue, ...this.selectors, newSelector);
    }

    public thenByDescending<TKey>(keySelector: Func<TKey, T>): IOrderedEnumerable<T> {
        Argument.isNotNullOrUndefined(keySelector, 'keySelector');

        const newSelector = new DescendingSortItemSelector(keySelector);

        return new OrderedEnumerable(super.getValue, ...this.selectors, newSelector);
    }

    protected getValue(): T[] {
        const value = super.getValue();
        if (TypeUtils.isNullOrUndefined(value)) {
            return value;
        }

        return value.sort((left, right) => {
            for (const selector of this.selectors) {
                const selectedItem = selector.select(left, right);
                if (selectedItem != SelectedSortItem.none) {
                    return selectedItem;
                }
            }

            return SelectedSortItem.none;
        });
    }
}
