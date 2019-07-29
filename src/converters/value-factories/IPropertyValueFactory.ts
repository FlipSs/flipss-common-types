export interface IPropertyValueFactory<TSource, TValue> {
    create(source: Readonly<TSource>): TValue;
}
