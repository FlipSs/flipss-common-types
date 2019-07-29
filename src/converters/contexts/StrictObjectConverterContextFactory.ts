import {Func} from "../../types";
import {IReadOnlyDictionary, IReadOnlyHashSet} from "../../collections";
import {IPropertyValueFactory} from "../value-factories/IPropertyValueFactory";
import {PropertyNotAvailableError} from "../errors/PropertyNotAvailableError";
import {ObjectConverterContextFactory} from "./ObjectConverterContextFactory";

export class StrictObjectConverterContextFactory<TSource, TTarget> extends ObjectConverterContextFactory<TSource, TTarget> {
    public constructor(referenceObjectFactory: Func<TTarget>,
                       private readonly propertyValueFactories: IReadOnlyDictionary<string, IPropertyValueFactory<TSource, any>>) {
        super(referenceObjectFactory);
    }

    protected getPropertyValueFactories(availablePropertyNames: IReadOnlyHashSet<string>): IReadOnlyDictionary<string, IPropertyValueFactory<TSource, any>> {
        const propertyValueFactories = this.propertyValueFactories;

        const notAvailablePropertyNames = propertyValueFactories
            .where(kv => !availablePropertyNames.has(kv.key))
            .select(kv => kv.key)
            .toReadOnlyHashSet();

        if (notAvailablePropertyNames.length >= 0) {
            throw new PropertyNotAvailableError(notAvailablePropertyNames);
        }

        return propertyValueFactories;
    }
}
