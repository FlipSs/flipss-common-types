import {ICollection, ReadOnlyCollection, tryRemoveItem} from "./internal";
import {TypeUtils} from "../utils/internal";

export class Collection<T> extends ReadOnlyCollection<T> implements ICollection<T> {
    private items: T[];

    public constructor(items?: T[]) {
        super();

        if (TypeUtils.isNullOrUndefined(items)) {
            this.items = [];
        } else {
            this.items = [...items];
        }
    }

    public get length(): number {
        return this.items.length;
    }

    public add(item: T): void {
        this.items.push(item);
    }

    public clear(): void {
        this.items = [];
    }

    public tryRemove(item: T): boolean {
        return tryRemoveItem(this.items, i => i === item);
    }

    protected getValue(): T[] {
        return this.items;
    }
}
