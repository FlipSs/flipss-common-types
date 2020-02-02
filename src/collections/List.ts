import {IList, ReadOnlyCollection, tryRemoveValueFromArray} from "./internal";
import {Argument, TypeUtils} from "../utils/internal";

export class List<T> extends ReadOnlyCollection<T> implements IList<T> {
    private _values: T[];

    public constructor(values?: Iterable<T>) {
        super();

        if (TypeUtils.isNullOrUndefined(values)) {
            this._values = [];
        } else {
            this._values = [...values];
        }
    }

    public add(value: T): void {
        this._values.push(value);
    }

    public clear(): ReadonlyArray<T> {
        const result = this._values;

        this._values = [];

        return result;
    }

    public tryRemove(value: T): boolean {
        return tryRemoveValueFromArray(this._values, i => i === value);
    }

    public addRange(values: Iterable<T>): void {
        Argument.isNotNullOrUndefined(values, 'values');

        for (const value of values) {
            this.add(value);
        }
    }

    public getArray(): T[] {
        return this._values;
    }

    public get(index: number): T {
        return this._values[index];
    }

    protected getValues(): T[] {
        return this._values;
    }
}
