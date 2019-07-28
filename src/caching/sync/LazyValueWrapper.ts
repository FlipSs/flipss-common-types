import {ILazy, Lazy} from "../../utils";
import {Func} from "../../types";
import {IValueWrapper} from "./IValueWrapper";

export class LazyValueWrapper<T> implements IValueWrapper<T> {
    private readonly value: ILazy<T>;

    public constructor(private readonly valueFactory: Func<T>) {
        this.value = new Lazy(valueFactory);
    }

    public getValue(): T {
        return this.value.value;
    }

    public updateValue(): void {
        this.value.reset();
    }
}
