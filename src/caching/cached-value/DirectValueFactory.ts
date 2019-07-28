import {IValueFactory} from "./IValueFactory";
import {Func} from "../../types";

export class DirectValueFactory<T> implements IValueFactory<T> {
    public constructor(private readonly valueFactory: Func<T>) {
    }

    public createValue(): T {
        return this.valueFactory();
    }
}
