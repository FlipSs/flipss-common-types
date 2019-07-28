import {Func} from "../../types";
import {IValueWrapper} from "./IValueWrapper";

export class InstantValueWrapper<T> implements IValueWrapper<T> {
    private value: T;

    public constructor(private readonly valueFactory: Func<T>) {
        this.updateValue();
    }

    public getValue(): T {
        return this.value;
    }

    public updateValue(): void {
        this.value = this.valueFactory();
    }
}
