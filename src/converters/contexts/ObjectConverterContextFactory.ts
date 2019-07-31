import {IObjectConverterContextFactory} from "./IObjectConverterContextFactory";
import {Func} from "../../types";
import {IObjectConverterContext} from "./IObjectConverterContext";
import {TypeUtils} from "../../utils";
import {ReferenceObjectIsNullOrUndefinedError} from "../errors/ReferenceObjectIsNullOrUndefinedError";
import {IReadOnlyDictionary, IReadOnlyHashSet} from "../../collections";
import {IPropertyValueFactory} from "../value-factories/IPropertyValueFactory";
import {IValueIgnoreStrategy} from "../IValueIgnoreStrategy";
import {getAvailablePropertyNames} from "../helpers";

export abstract class ObjectConverterContextFactory<TSource, TTarget> implements IObjectConverterContextFactory<TSource, TTarget> {
    protected constructor(private readonly referenceObjectFactory: Func<TTarget>,
                          private readonly valueIgnoreStrategy: IValueIgnoreStrategy) {
    }

    public create(): IObjectConverterContext<TSource, TTarget> {
        const referenceObject = this.referenceObjectFactory();
        if (TypeUtils.isNullOrUndefined(referenceObject)) {
            throw new ReferenceObjectIsNullOrUndefinedError();
        }

        const availablePropertyNames = getAvailablePropertyNames(referenceObject);

        return {
            referenceObject: referenceObject,
            availablePropertyNames: availablePropertyNames,
            propertyValueFactories: this.getPropertyValueFactories(availablePropertyNames),
            valueIgnoreStrategy: this.valueIgnoreStrategy
        }
    }

    protected abstract getPropertyValueFactories(availablePropertyNames: IReadOnlyHashSet<string>): IReadOnlyDictionary<string, IPropertyValueFactory<TSource, any>>;
}
