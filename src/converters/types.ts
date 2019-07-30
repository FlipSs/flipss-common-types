export type ObjectConverterConvertiblePropertyNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];

export type ObjectConverterTypedConvertiblePropertyNames<TSource, T> = { [K in keyof TSource]: TSource[K] extends T ? K : never }[ObjectConverterConvertiblePropertyNames<TSource>];
