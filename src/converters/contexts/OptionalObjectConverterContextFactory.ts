import {Func} from "../../types/internal";
import {IReadOnlyDictionary, IReadOnlySet} from "../../collections/internal";
import {IPropertyValueFactory, IValueIgnoreStrategy, ObjectConverterContextFactory} from "../internal";

export class OptionalObjectConverterContextFactory<TSource, TTarget> extends ObjectConverterContextFactory<TSource, TTarget> {
    public constructor(referenceObjectFactory: Func<TTarget>,
                       valueIgnoreStrategy: IValueIgnoreStrategy,
                       private readonly _propertyValueFactories: IReadOnlyDictionary<string, IPropertyValueFactory<TSource, any>>) {
        super(referenceObjectFactory, valueIgnoreStrategy);
    }

    protected getPropertyValueFactories(availablePropertyNames: IReadOnlySet<string>): IReadOnlyDictionary<string, IPropertyValueFactory<TSource, any>> {
        return this._propertyValueFactories
            .where(kv => availablePropertyNames.has(kv.key))
            .toReadOnlyDictionary(kv => kv.key, kv => kv.value);
    }
}
