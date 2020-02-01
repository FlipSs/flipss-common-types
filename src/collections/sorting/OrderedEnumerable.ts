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
    private readonly _comparerArray!: ISortItemComparer<T>[];

    public constructor(valueFactory: Func<T[]>,
                       comparer: ISortItemComparer<T>) {
        super(valueFactory);

        this._comparerArray = [comparer];
    }

    public thenBy<TKey>(keySelector: Func<TKey, T>, comparer?: IComparer<TKey>): IOrderedEnumerable<T> {
        Argument.isNotNullOrUndefined(keySelector, 'keySelector');

        this.addComparer(new AscendingSortItemComparer(keySelector, comparer));

        return this;
    }

    public thenByDescending<TKey>(keySelector: Func<TKey, T>, comparer?: IComparer<TKey>): IOrderedEnumerable<T> {
        Argument.isNotNullOrUndefined(keySelector, 'keySelector');

        this.addComparer(new DescendingSortItemComparer(keySelector, comparer));

        return this;
    }

    protected getValue(): T[] {
        const value = super.getValue();
        if (TypeUtils.isNullOrUndefined(value)) {
            return value;
        }

        return value.sort((left, right) => {
            for (const comparer of this._comparerArray) {
                const compareResult = comparer.compare(left, right);
                if (compareResult !== 0) {
                    return compareResult;
                }
            }

            return 0;
        });
    }

    private addComparer(comparer: ISortItemComparer<T>): void {
        this._comparerArray.push(comparer);
    }
}
