import {IReadOnlyDictionary, IReadOnlyHashSet} from "../../collections";
import {IPropertyValueFactory} from "../value-factories/IPropertyValueFactory";
import {IValueIgnoreStrategy} from "../IValueIgnoreStrategy";

export interface IObjectConverterContext<TSource, TTarget> {
    readonly referenceObject: TTarget;
    readonly valueIgnoreStrategy: IValueIgnoreStrategy;
    readonly availablePropertyNames: IReadOnlyHashSet<string>;
    readonly propertyValueFactories: IReadOnlyDictionary<string, IPropertyValueFactory<TSource, any>>;
}
