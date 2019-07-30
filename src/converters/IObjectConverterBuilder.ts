import {Func} from "../types";
import {IObjectConverter,} from "./IObjectConverter";
import {ObjectConverterConvertiblePropertyNames, ObjectConverterTypedConvertiblePropertyNames} from "./types";

export interface IObjectConverterBuilder<TSource, TTarget> {
    useDirectPropertyTransferring(excludedProperties?: ObjectConverterConvertiblePropertyNames<TSource>[]): IObjectConverterBuilder<TSource, TTarget>;

    setProperty<TValue>(sourcePropertyName: ObjectConverterTypedConvertiblePropertyNames<TSource, TValue>, targetPropertyName: ObjectConverterTypedConvertiblePropertyNames<TTarget, TValue>): IObjectConverterBuilder<TSource, TTarget>;

    set<TValue>(valueFactory: Func<TValue, Readonly<TSource>>, targetPropertyName: ObjectConverterTypedConvertiblePropertyNames<TTarget, TValue>): IObjectConverterBuilder<TSource, TTarget>;

    setConstant<TValue>(value: TValue, targetPropertyName: ObjectConverterTypedConvertiblePropertyNames<TTarget, TValue>): IObjectConverterBuilder<TSource, TTarget>;

    enableStrictMode(): IObjectConverterBuilder<TSource, TTarget>;

    ignoreNullAndUndefinedValues(): IObjectConverterBuilder<TSource, TTarget>;

    create(): IObjectConverter<TSource, TTarget>;
}
