import {IValueFactory, IValueFactoryWrapper} from "../internal";
import {Observable} from "../../common/Observable";

export class DirectValueFactoryWrapper<T> extends Observable implements IValueFactoryWrapper<T> {
    private _value: T;

    public constructor(private readonly _valueFactory: IValueFactory<T>) {
        super();

        this.updateValue();
    }

    public getValue(): T {
        return this._value;
    }

    public updateValue(silent?: boolean): void {
        this._value = this._valueFactory.createValue();

        if (!silent) {
            this.next();
        }
    }
}
