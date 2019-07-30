import {IObjectConverterBuilder} from "./IObjectConverterBuilder";
import {Argument, TypeUtils} from "../utils";
import {Func} from "../types";
import {IReferenceObjectConstructor} from "./IReferenceObjectConstructor";
import {ObjectConverterBuilder} from "./ObjectConverterBuilder";
import {asEnumerable, IReadOnlyHashSet} from "../collections";

export function buildObjectConverterUsingConstructor<TSource, TTarget>(referenceObjectConstructor: IReferenceObjectConstructor<TTarget>): IObjectConverterBuilder<TSource, TTarget> {
    Argument.isNotNullOrUndefined(referenceObjectConstructor, 'referenceObjectConstructor');

    return new ObjectConverterBuilder(() => new referenceObjectConstructor());
}

export function buildObjectConverter<TSource, TTarget>(referenceObjectFactory: Func<TTarget>): IObjectConverterBuilder<TSource, TTarget> {
    Argument.isNotNullOrUndefined(referenceObjectFactory, 'referenceObjectFactory');

    return new ObjectConverterBuilder(referenceObjectFactory);
}

export function getAvailablePropertyNames(value: any): IReadOnlyHashSet<string> {
    return asEnumerable(Object.getOwnPropertyNames(value)).where(p => {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(value, p);

        return !TypeUtils.isNullOrUndefined(propertyDescriptor) && propertyDescriptor.writable;
    }).toReadOnlyHashSet();
}
