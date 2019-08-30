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
    private readonly comparer: IEqualityComparer<T>;
    private items: T[];

    public constructor(items?: Iterable<T>, comparer?: IEqualityComparer<T>) {
        super();

        this.comparer = getEqualityComparer(comparer);

        if (TypeUtils.isNullOrUndefined(items)) {
            this.items = [];
        } else {
            this.items = this.getUniqueItems(items);
        }
    }

    public get length(): number {
        return this.items.length;
    }

    public clear(): void {
        this.items = [];
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
        for (const item of this.items) {
            if (this.containsValue(uniqueItems, item)) {
                newItems.push(item);
            }
        }

        this.items = newItems;
    }

    public tryRemove(value: T): boolean {
        return tryRemoveItem(this.items, i => this.comparer.equals(i, value));
    }

    public tryAdd(value: T): boolean {
        if (this.hasValue(value)) {
            return false;
        }

        this.items.push(value);

        return true;
    }

    protected getValue(): T[] {
        return this.items;
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
        return this.containsValue(this.items, value);
    }

    private containsValue(items: T[], value: T): boolean {
        return containsValue(items, value, this.comparer);
    }
}
