import {IValueFactory} from "../internal";
import {Func} from "../../types/internal";

export class DirectValueFactory<T> implements IValueFactory<T> {
    public constructor(private readonly _valueFactory: Func<T>) {
    }

    public createValue(): T {
        return this._valueFactory();
    }
}
