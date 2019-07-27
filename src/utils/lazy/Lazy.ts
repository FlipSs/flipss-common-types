import {Func} from "../../types";
import {ILazy} from "./ILazy";
import {Argument} from "../Argument";

export class Lazy<T> implements ILazy<T> {
    private initialized: boolean;
    private currentValue: T;

    public constructor(private readonly valueFactory: Func<T>) {
        Argument.isNotNullOrUndefined(valueFactory, 'valueFactory');

        this.reset();
    }

    public get value(): T {
        if (!this.initialized) {
            this.currentValue = this.valueFactory();
            this.initialized = true;
        }

        return this.currentValue;
    }

    public reset(): void {
        this.initialized = false;
    }
}
