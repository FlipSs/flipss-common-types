import {IEnumerable} from "./IEnumerable";
import {Argument, TypeUtils} from "../utils";
import {IHashSet} from "./IHashSet";
import {ReadOnlyCollection} from "./ReadOnlyCollection";

export class HashSet<T> extends ReadOnlyCollection<T> implements IHashSet<T> {
    private set: Set<T>;

    public constructor(items?: T[]) {
        super();

        this.set = new Set(items);
    }

    public get length(): number {
        return this.set.size;
    }

    public add(value: T): void {
        this.set.add(value);
    }

    public clear(): void {
        this.set.clear();
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
        return this.set.has(value);
    }

    public intersectWith(other: IEnumerable<T>): void {
        Argument.isNotNullOrUndefined(other, 'other');

        const otherItems = other.toArray();

        this.set = new Set(otherItems && otherItems.filter(i => this.set.has(i)));
    }

    public tryRemove(value: T): boolean {
        return this.set.delete(value);
    }

    protected getValue(): T[] {
        return Array.from(this.set);
    }
}
