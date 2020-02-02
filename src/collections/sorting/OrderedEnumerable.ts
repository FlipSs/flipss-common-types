import {Func} from "../../types/internal";
import {
    AscendingSortItemComparer,
    DescendingSortItemComparer,
    IComparer,
    IOrderedEnumerable,
    ISortItemComparer,
    IterableAsEnumerable,
    toArray
} from "../internal";
import {Argument} from "../../utils/internal";

export class OrderedEnumerable<T> extends IterableAsEnumerable<T> implements IOrderedEnumerable<T> {
    private readonly _comparerArray!: ISortItemComparer<T>[];

    public constructor(values: Iterable<T>,
                       comparer: ISortItemComparer<T>) {
        super(values);

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

    protected* getValues(): Iterable<T> {
        const values = toArray(super.getValues());
        if (values.length > 0) {
            for (const comparer of this._comparerArray) {
                comparer.initialize(values);
            }

            const count = values.length;
            const indices = [];
            for (let i = 0; i < count; i++) {
                indices.push(i);
            }

            for (const index of indices.sort((a, b) => this.compareIndices(a, b))) {
                yield values[index];
            }
        }
    }

    private addComparer(comparer: ISortItemComparer<T>): void {
        this._comparerArray.push(comparer);
    }

    private compareIndices(left: number, right: number): number {
        let result = 0;
        for (const comparer of this._comparerArray) {
            result = comparer.compare(left, right);
            if (result !== 0) {
                return result;
            }
        }

        return result;
    }
}
