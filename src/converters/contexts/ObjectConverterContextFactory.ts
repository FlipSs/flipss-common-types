import {
    getAvailablePropertyNames,
    IObjectConverterContext,
    IObjectConverterContextFactory,
    IPropertyValueFactory,
    IValueIgnoreStrategy,
    ReferenceObjectIsNullOrUndefinedError
} from "../internal";
import {Func} from "../../types/internal";
import {TypeUtils} from "../../utils";
import {IReadOnlyDictionary, IReadOnlySet} from "../../collections/internal";

export abstract class ObjectConverterContextFactory<TSource, TTarget> implements IObjectConverterContextFactory<TSource, TTarget> {
    protected constructor(private readonly _referenceObjectFactory: Func<TTarget>,
                          private readonly _valueIgnoreStrategy: IValueIgnoreStrategy) {
    }

    public create(): IObjectConverterContext<TSource, TTarget> {
        const referenceObject = this._referenceObjectFactory();
        if (TypeUtils.isNullOrUndefined(referenceObject)) {
            throw new ReferenceObjectIsNullOrUndefinedError();
        }

        const availablePropertyNames = getAvailablePropertyNames(referenceObject);

        return {
            referenceObject: referenceObject,
            availablePropertyNames: availablePropertyNames,
            propertyValueFactories: this.getPropertyValueFactories(availablePropertyNames),
            valueIgnoreStrategy: this._valueIgnoreStrategy
        }
    }

    protected abstract getPropertyValueFactories(availablePropertyNames: IReadOnlySet<string>): IReadOnlyDictionary<string, IPropertyValueFactory<TSource, any>>;
}
