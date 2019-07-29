export type ObjectConverterConvertiblePropertyNames<T> = keyof T;

export type ObjectConverterTypedConvertiblePropertyNames<TSource, T> = { [K in keyof TSource]: TSource[K] extends T ? K : never }[ObjectConverterConvertiblePropertyNames<TSource>];
