import {IPropertyValueFactory} from "./IPropertyValueFactory";
import {Func} from "../../types";

export class CreatedPropertyValueFactory<TSource, TValue> implements IPropertyValueFactory<TSource, TValue> {
    public constructor(private readonly valueFactory: Func<TValue, Readonly<TSource>>) {
    }

    public create(source: Readonly<TSource>): TValue {
        return this.valueFactory(source);
    }
}
