import {Func} from "../../types/internal";
import {IReadOnlyDictionary} from "../../collections/internal";
import {IObjectConverterContextFactory, IPropertyValueFactory, IValueIgnoreStrategy} from "../internal";

export interface IObjectConverterContextFactoryConstructor<TSource, TTarget> {
    new(referenceObjectFactory: Func<TTarget>,
        valueIgnoreStrategy: IValueIgnoreStrategy,
        propertyValueFactories: IReadOnlyDictionary<string, IPropertyValueFactory<TSource, any>>): IObjectConverterContextFactory<TSource, TTarget>;
}
