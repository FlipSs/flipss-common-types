import {
    containsValue,
    getEqualityComparer,
    IEqualityComparer,
    ISet,
    ReadOnlyCollection,
    tryRemoveItem
} from "./internal";
import {Argument, TypeUtils} from "../utils/internal";

export class Set<T> extends ReadOnlyCollection<T> implements ISet<T> {
    private readonly _comparer!: IEqualityComparer<T>;
    private _items!: T[];

    public constructor(items?: Iterable<T>, comparer?: IEqualityComparer<T>) {
        super();

        this._comparer = getEqualityComparer(comparer);

        if (TypeUtils.isNullOrUndefined(items)) {
            this._items = [];
        } else {
            this._items = this.getUniqueItems(items);
        }
    }

    public get length(): number {
        return this._items.length;
    }

    public clear(): void {
        this._items = [];
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

        const newItems = [];
        const uniqueItems = this.getUniqueItems(other);
        for (const item of this._items) {
            if (this.containsValue(uniqueItems, item)) {
                newItems.push(item);
            }
        }

        this._items = newItems;
    }

    public tryRemove(value: T): boolean {
        return tryRemoveItem(this._items, i => this._comparer.equals(i, value));
    }

    public tryAdd(value: T): boolean {
        if (this.hasValue(value)) {
            return false;
        }

        this._items.push(value);

        return true;
    }

    protected getValue(): T[] {
        return this._items;
    }

    private getUniqueItems(items: Iterable<T>): T[] {
        const result = [];
        for (const item of items) {
            if (!this.containsValue(result, item)) {
                result.push(item);
            }
        }

        return result;
    }

    private hasValue(value: T): boolean {
        return this.containsValue(this._items, value);
    }

    private containsValue(items: T[], value: T): boolean {
        return containsValue(items, value, this._comparer);
    }
}
