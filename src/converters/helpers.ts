import {IObjectConverterBuilder, ObjectConverterBuilder} from "./internal";
import {Argument, TypeUtils} from "../utils/internal";
import {Func} from "../types/internal";
import {asEnumerable, IReadOnlyHashSet} from "../collections/internal";
import {IConstructorWithoutParameters} from "../models/internal";

export function buildObjectConverterUsingConstructor<TSource, TTarget>(referenceObjectConstructor: IConstructorWithoutParameters<TTarget>): IObjectConverterBuilder<TSource, TTarget> {
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
