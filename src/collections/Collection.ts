import {ICollection} from "./ICollection";
import {Enumerable} from "./Enumerable";
import {TypeUtils} from "../utils";

export class Collection<T> extends Enumerable<T> implements ICollection<T> {
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
        const itemIndex = this.items.findIndex(i => i === value);
        if (itemIndex < 0) {
            return false;
        }

        this.items.splice(itemIndex, 1);

        return true;
    }

    protected getValue(): T[] {
        return this.items;
    }
}
