import {IPropertyValueFactory} from "../internal";
import {Func} from "../../types/internal";

export class CreatedPropertyValueFactory<TSource, TValue> implements IPropertyValueFactory<TSource, TValue> {
    public constructor(private readonly valueFactory: Func<TValue, Readonly<TSource>>) {
    }

    public create(source: Readonly<TSource>): TValue {
        return this.valueFactory(source);
    }
}
