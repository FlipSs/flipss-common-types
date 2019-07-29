export interface IObjectConverter<TSource, TTarget> {
    convert(source: TSource): TTarget;
}
