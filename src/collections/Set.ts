import {
    containsValue,
    getEqualityComparer,
    IEnumerable,
    IEqualityComparer,
    ISet,
    ReadOnlyCollection,
    tryRemoveItem
} from "./internal";
import {Argument, TypeUtils} from "../utils/internal";

export class Set<T> extends ReadOnlyCollection<T> implements ISet<T> {
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

    public has(value: T): boolean {
        return this.hasValue(value);
    }

    public intersectWith(other: IEnumerable<T>): void {
        Argument.isNotNullOrUndefined(other, 'other');

        const otherItems = other.toArray();
        if (TypeUtils.isNullOrUndefined(otherItems)) {
            this.items = [];

            return;
        }

        this.items = otherItems.filter(i => this.hasValue(i));
    }

    public tryRemove(value: T): boolean {
        return tryRemoveItem(this.items, i => this.hasValue(i));
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

    private hasValue(value: T): boolean {
        return containsValue(this.items, value, this.comparer);
    }
}
