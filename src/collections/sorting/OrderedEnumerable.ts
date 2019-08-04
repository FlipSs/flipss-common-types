import {Func} from "../../types/internal";
import {
    AscendingSortItemComparer,
    DeferredEnumerable,
    DescendingSortItemComparer,
    IComparer,
    IOrderedEnumerable,
    ISortItemComparer
} from "../internal";
import {Argument, TypeUtils} from "../../utils/internal";

export class OrderedEnumerable<T> extends DeferredEnumerable<T> implements IOrderedEnumerable<T> {
    private readonly comparerArray: ISortItemComparer<T>[];

    public constructor(valueFactory: Func<T[]>,
                       ...selectors: ISortItemComparer<T>[]) {
        super(valueFactory);

        this.comparerArray = selectors;
    }

    public thenBy<TKey>(keySelector: Func<TKey, T>, comparer?: IComparer<TKey>): IOrderedEnumerable<T> {
        Argument.isNotNullOrUndefined(keySelector, 'keySelector');

        const sortItemComparer = new AscendingSortItemComparer(keySelector, comparer);

        return new OrderedEnumerable(super.getValue, ...this.comparerArray, sortItemComparer);
    }

    public thenByDescending<TKey>(keySelector: Func<TKey, T>, comparer?: IComparer<TKey>): IOrderedEnumerable<T> {
        Argument.isNotNullOrUndefined(keySelector, 'keySelector');

        const sortItemComparer = new DescendingSortItemComparer(keySelector, comparer);

        return new OrderedEnumerable(super.getValue, ...this.comparerArray, sortItemComparer);
    }

    protected getValue(): T[] {
        const value = super.getValue();
        if (TypeUtils.isNullOrUndefined(value)) {
            return value;
        }

        return value.sort((left, right) => {
            for (const comparer of this.comparerArray) {
                const compareResult = comparer.compare(left, right);
                if (compareResult !== 0) {
                    return compareResult;
                }
            }

            return 0;
        });
    }
}
