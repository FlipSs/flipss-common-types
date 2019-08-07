import {IList, ReadOnlyCollection, tryRemoveItem} from "./internal";
import {TypeUtils} from "../utils/internal";

export class List<T> extends ReadOnlyCollection<T> implements IList<T> {
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

    public add(value: T): void {
        this.items.push(value);
    }

    public clear(): void {
        this.items = [];
    }

    public tryRemove(value: T): boolean {
        return tryRemoveItem(this.items, i => i === value);
    }

    protected getValue(): T[] {
        return this.items;
    }
}
