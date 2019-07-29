import {IObjectConverterBuilder} from "./IObjectConverterBuilder";
import {Argument} from "../utils";
import {Func} from "../types";
import {IReferenceObjectConstructor} from "./IReferenceObjectConstructor";
import {ObjectConverterBuilder} from "./ObjectConverterBuilder";

export function buildObjectConverterUsingConstructor<TSource, TTarget>(referenceObjectConstructor: IReferenceObjectConstructor<TTarget>): IObjectConverterBuilder<TSource, TTarget> {
    Argument.isNotNullOrUndefined(referenceObjectConstructor, 'referenceObjectConstructor');

    return new ObjectConverterBuilder(() => new referenceObjectConstructor());
}

export function buildObjectConverter<TSource, TTarget>(referenceObjectFactory: Func<TTarget>): IObjectConverterBuilder<TSource, TTarget> {
    Argument.isNotNullOrUndefined(referenceObjectFactory, 'referenceObjectFactory');

    return new ObjectConverterBuilder(referenceObjectFactory);
}
