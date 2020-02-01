import {getEqualityComparer, IEqualityComparer, ISet, ReadOnlyCollection, tryRemoveValueFromArray} from "./internal";
import {Argument, TypeUtils} from "../utils/internal";

export class Set<T> extends ReadOnlyCollection<T> implements ISet<T> {
    private readonly _comparer!: IEqualityComparer<T>;
    private _values!: T[];

    public constructor(values?: Iterable<T>, comparer?: IEqualityComparer<T>) {
        super();

        this._comparer = getEqualityComparer(comparer);

        if (TypeUtils.isNullOrUndefined(values)) {
            this._values = [];
        } else {
            this._values = this.getUniqueValues(values);
        }
    }

    public clear(): void {
        this._values = [];
    }

    public exceptWith(other: Iterable<T>): void {
        Argument.isNotNullOrUndefined(other, 'other');

        for (let item of other) {
            this.tryRemove(item);
        }
    }

    public has(value: T): boolean {
        return this.hasValue(value);
    }

    public intersectWith(other: Iterable<T>): void {
        Argument.isNotNullOrUndefined(other, 'other');

        const newValues = [];
        const uniqueValues = this.getUniqueValues(other);
        for (const value of this._values) {
            if (this.containsValue(uniqueValues, value)) {
                newValues.push(value);
            }
        }

        this._values = newValues;
    }

    public tryRemove(value: T): boolean {
        return tryRemoveValueFromArray(this._values, i => this._comparer.equals(i, value));
    }

    public tryAdd(value: T): boolean {
        if (this.hasValue(value)) {
            return false;
        }

        this._values.push(value);

        return true;
    }

    public getArray(): T[] {
        return this._values;
    }

    private getUniqueValues(values: Iterable<T>): T[] {
        const result = [];
        for (const value of values) {
            if (!this.containsValue(result, value)) {
                result.push(value);
            }
        }

        return result;
    }

    private hasValue(value: T): boolean {
        return this.containsValue(this._values, value);
    }

    private containsValue(values: T[], value: T): boolean {
        return values.some(i => this._comparer.equals(i, value));
    }
}
