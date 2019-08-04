import {
    containsItem,
    getEqualityComparer,
    IEnumerable,
    IEqualityComparer,
    IHashSet,
    ReadOnlyCollection,
    tryRemoveItem
} from "./internal";
import {Argument, TypeUtils} from "../utils/internal";

export class HashSet<T> extends ReadOnlyCollection<T> implements IHashSet<T> {
    private readonly comparer: IEqualityComparer<T>;
    private items: T[];

    public constructor(items?: T[], comparer?: IEqualityComparer<T>) {
        super();

        this.comparer = getEqualityComparer(comparer);
        this.items = [];

        if (!TypeUtils.isNullOrUndefined(items)) {
            for (const item of items) {
                this.tryAdd(item);
            }
        }
    }

    public get length(): number {
        return this.items.length;
    }

    public clear(): void {
        this.items = [];
    }

    public exceptWith(other: IEnumerable<T>): void {
        Argument.isNotNullOrUndefined(other, 'other');

        const otherItems = other.toArray();
        if (TypeUtils.isNullOrUndefined(otherItems)) {
            return;
        }

        for (let item of otherItems) {
            this.tryRemove(item);
        }
    }

    public has(item: T): boolean {
        return this.hasItem(item);
    }

    public intersectWith(other: IEnumerable<T>): void {
        Argument.isNotNullOrUndefined(other, 'other');

        const otherItems = other.toArray();
        if (TypeUtils.isNullOrUndefined(otherItems)) {
            this.items = [];

            return;
        }

        this.items = otherItems.filter(i => this.hasItem(i));
    }

    public tryRemove(item: T): boolean {
        return tryRemoveItem(this.items, i => this.hasItem(i));
    }

    public tryAdd(item: T): boolean {
        if (this.hasItem(item)) {
            return false;
        }

        this.items.push(item);

        return true;
    }

    protected getValue(): T[] {
        return Array.from(this.items);
    }

    private hasItem(item: T): boolean {
        return containsItem(this.items, item, this.comparer);
    }
}
