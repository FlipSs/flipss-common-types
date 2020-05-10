import {IStorageValue} from "./IStorageValue";
import {IValueStorage} from "./IValueStorage";

export class MemoryStorage<T> implements IValueStorage<T> {
    private _value: IStorageValue<T> | null;

    public constructor() {
        this.clear();
    }

    public clear(): void {
        this._value = null;
    }

    public get(): IStorageValue<T> | null {
        return this._value;
    }

    public set(value: T): void {
        this._value = {
            value,
            createdOn: new Date()
        };
    }
}
