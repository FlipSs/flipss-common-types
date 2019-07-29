import {IReadOnlyDictionary} from "../../collections";
import {IPropertyValueFactory} from "../value-factories/IPropertyValueFactory";

export interface IObjectConverterContext<TSource, TTarget> {
    readonly referenceObject: TTarget;
    readonly propertyValueFactories: IReadOnlyDictionary<string, IPropertyValueFactory<TSource, any>>;
}
