import {IValueFactory, IValueWrapper} from "../internal";

export class DirectValueWrapper<T> implements IValueWrapper<T> {
    private value: T;

    public constructor(private readonly valueFactory: IValueFactory<T>) {
        this.updateValue();
    }

    public getValue(): T {
        return this.value;
    }

    public updateValue(): void {
        this.value = this.valueFactory.createValue();
    }
}
