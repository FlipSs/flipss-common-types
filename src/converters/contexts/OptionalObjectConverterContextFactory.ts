import {Func} from "../../types";
import {IReadOnlyDictionary, IReadOnlyHashSet} from "../../collections";
import {IPropertyValueFactory} from "../value-factories/IPropertyValueFactory";
import {ObjectConverterContextFactory} from "./ObjectConverterContextFactory";

export class OptionalObjectConverterContextFactory<TSource, TTarget> extends ObjectConverterContextFactory<TSource, TTarget> {
    public constructor(referenceObjectFactory: Func<TTarget>,
                       private readonly propertyValueFactories: IReadOnlyDictionary<string, IPropertyValueFactory<TSource, any>>) {
        super(referenceObjectFactory);
    }

    protected getPropertyValueFactories(availablePropertyNames: IReadOnlyHashSet<string>): IReadOnlyDictionary<string, IPropertyValueFactory<TSource, any>> {
        return this.propertyValueFactories
            .where(kv => availablePropertyNames.has(kv.key))
            .toReadOnlyDictionary(kv => kv.key, kv => kv.value);
    }
}
