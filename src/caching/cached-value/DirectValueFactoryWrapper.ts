import {IValueFactory, IValueFactoryWrapper} from "../internal";

export class DirectValueFactoryWrapper<T> implements IValueFactoryWrapper<T> {
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
