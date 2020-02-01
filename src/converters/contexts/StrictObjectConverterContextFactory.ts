import {Func} from "../../types/internal";
import {IReadOnlyDictionary, IReadOnlySet} from "../../collections/internal";
import {
    IPropertyValueFactory,
    IValueIgnoreStrategy,
    ObjectConverterContextFactory,
    PropertyNotAvailableError
} from "../internal";

export class StrictObjectConverterContextFactory<TSource, TTarget> extends ObjectConverterContextFactory<TSource, TTarget> {
    public constructor(referenceObjectFactory: Func<TTarget>,
                       valueIgnoreStrategy: IValueIgnoreStrategy,
                       private readonly _propertyValueFactories: IReadOnlyDictionary<string, IPropertyValueFactory<TSource, any>>) {
        super(referenceObjectFactory, valueIgnoreStrategy);
    }

    protected getPropertyValueFactories(availablePropertyNames: IReadOnlySet<string>): IReadOnlyDictionary<string, IPropertyValueFactory<TSource, any>> {
        const propertyValueFactories = this._propertyValueFactories;

        const notAvailablePropertyNames = propertyValueFactories
            .where(kv => !availablePropertyNames.has(kv.key))
            .select(kv => kv.key)
            .toReadOnlySet();

        if (notAvailablePropertyNames.length > 0) {
            throw new PropertyNotAvailableError(notAvailablePropertyNames);
        }

        return propertyValueFactories;
    }
}
