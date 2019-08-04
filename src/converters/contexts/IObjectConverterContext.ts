import {IReadOnlyDictionary, IReadOnlySet} from "../../collections/internal";
import {IPropertyValueFactory, IValueIgnoreStrategy} from "../internal";

export interface IObjectConverterContext<TSource, TTarget> {
    readonly referenceObject: TTarget;
    readonly valueIgnoreStrategy: IValueIgnoreStrategy;
    readonly availablePropertyNames: IReadOnlySet<string>;
    readonly propertyValueFactories: IReadOnlyDictionary<string, IPropertyValueFactory<TSource, any>>;
}
