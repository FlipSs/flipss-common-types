import {Func} from "../../types/internal";
import {
    AscendingSortItemComparer,
    DescendingSortItemComparer,
    IComparer,
    IOrderedEnumerable,
    ISortItemComparer,
    IterableAsEnumerable
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
        const values = Array.from(super.getValues());
        if (values.length > 0) {
            for (const comparer of this._comparerArray) {
                comparer.initialize(values);
            }

            const count = values.length;
            const indices = [];
            for (let i = 0; i < count; i++) {
                indices.push(i);
            }

            this.quickSort(indices, 0, count - 1);

            for (const index of indices) {
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

        return result === 0 ? left - right : result;
    }

    private quickSort(indices: number[], left: number, right: number): void {
        do {
            let i = left;
            let j = right;
            let x = indices[i + ((j - i) >> 1)];
            do {
                while (i < indices.length && this.compareIndices(x, indices[i]) > 0) {
                    i++;
                }

                while (j >= 0 && this.compareIndices(x, indices[j]) < 0) {
                    j--;
                }

                if (i > j) {
                    break;
                }

                if (i < j) {
                    let temp = indices[i];
                    indices[i] = indices[j];
                    indices[j] = temp;
                }

                i++;
                j--;
            } while (i <= j);

            if (j - left <= right - i) {
                if (left < j) {
                    this.quickSort(indices, left, j);
                }

                left = i;
            } else {
                if (i < right) {
                    this.quickSort(indices, i, right);
                }

                right = j;
            }
        } while (left < right);
    }
}
