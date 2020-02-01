import {IList, ReadOnlyCollection, tryRemoveItem} from "./internal";
import {Argument, TypeUtils} from "../utils/internal";

export class List<T> extends ReadOnlyCollection<T> implements IList<T> {
    private _items: T[];

    public constructor(items?: Iterable<T>) {
        super();

        if (TypeUtils.isNullOrUndefined(items)) {
            this._items = [];
        } else {
            this._items = [...items];
        }
    }

    public get length(): number {
        return this._items.length;
    }

    public add(value: T): void {
        this._items.push(value);
    }

    public clear(): ReadonlyArray<T> {
        const result = this._items;

        this._items = [];

        return result;
    }

    public tryRemove(value: T): boolean {
        return tryRemoveItem(this._items, i => i === value);
    }

    public addRange(values: Iterable<T>): void {
        Argument.isNotNullOrUndefined(values, 'values');

        for (const value of values) {
            this.add(value);
        }
    }

    protected getValue(): T[] {
        return this._items;
    }
}
