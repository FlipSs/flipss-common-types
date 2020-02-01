import {Argument, ILazy} from "../internal";
import {Func} from "../../types/internal";

export class Lazy<T> implements ILazy<T> {
    private _initialized: boolean;

    public constructor(private readonly valueFactory: Func<T>) {
        Argument.isNotNullOrUndefined(valueFactory, 'valueFactory');

        this.reset();
    }

    private _value: T;
    public get value(): T {
        if (!this._initialized) {
            this._value = this.valueFactory();
            this._initialized = true;
        }

        return this._value;
    }

    public reset(): void {
        this._initialized = false;
    }
}
