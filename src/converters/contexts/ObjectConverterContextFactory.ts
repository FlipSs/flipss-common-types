import {IObjectConverterContextFactory} from "./IObjectConverterContextFactory";
import {Func} from "../../types";
import {IObjectConverterContext} from "./IObjectConverterContext";
import {TypeUtils} from "../../utils";
import {ReferenceObjectIsNullOrUndefinedError} from "../errors/ReferenceObjectIsNullOrUndefinedError";
import {asEnumerable, IReadOnlyDictionary, IReadOnlyHashSet} from "../../collections";
import {IPropertyValueFactory} from "../value-factories/IPropertyValueFactory";

export abstract class ObjectConverterContextFactory<TSource, TTarget> implements IObjectConverterContextFactory<TSource, TTarget> {
    protected constructor(private readonly referenceObjectFactory: Func<TTarget>) {
    }

    public create(): IObjectConverterContext<TSource, TTarget> {
        const referenceObject = this.referenceObjectFactory();
        if (TypeUtils.isNullOrUndefined(referenceObject)) {
            throw new ReferenceObjectIsNullOrUndefinedError();
        }

        const availablePropertyNames = asEnumerable(Object.getOwnPropertyNames(referenceObject)).where(p => {
            const propertyDescriptor = Object.getOwnPropertyDescriptor(referenceObject, p);

            return !TypeUtils.isNullOrUndefined(propertyDescriptor) && propertyDescriptor.writable;
        }).toReadOnlyHashSet();

        const propertyValueFactories = this.getPropertyValueFactories(availablePropertyNames);

        return {
            referenceObject,
            propertyValueFactories
        }
    }

    protected abstract getPropertyValueFactories(availablePropertyNames: IReadOnlyHashSet<string>): IReadOnlyDictionary<string, IPropertyValueFactory<TSource, any>>;
}
