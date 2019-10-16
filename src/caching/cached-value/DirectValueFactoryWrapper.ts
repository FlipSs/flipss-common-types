import {IValueFactory, IValueFactoryWrapper} from "../internal";
import {Observable} from "../../common/Observable";

export class DirectValueFactoryWrapper<T> extends Observable implements IValueFactoryWrapper<T> {
    private value: T;

    public constructor(private readonly valueFactory: IValueFactory<T>) {
        super();

        this.updateValue();
    }

    public getValue(): T {
        return this.value;
    }

    public updateValue(): void {
        this.value = this.valueFactory.createValue();
        this.next();
    }
}
