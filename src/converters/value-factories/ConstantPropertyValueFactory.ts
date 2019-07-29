import {IPropertyValueFactory} from "./IPropertyValueFactory";

export class ConstantPropertyValueFactory<TSource, TValue> implements IPropertyValueFactory<TSource, TValue> {
    public constructor(private readonly value: TValue) {
    }

    public create(source: Readonly<TSource>): TValue {
        return this.value;
    }
}
