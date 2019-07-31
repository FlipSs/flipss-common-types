import {IPropertyValueFactory} from "../internal";

export class TransferredPropertyValueFactory<TSource, TValue> implements IPropertyValueFactory<TSource, TValue> {
    public constructor(private readonly propertyName: string) {
    }

    public create(source: Readonly<TSource>): TValue {
        return source[this.propertyName];
    }
}
