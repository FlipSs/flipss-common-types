import {Func} from "../../types";
import {IReadOnlyDictionary} from "../../collections";
import {IPropertyValueFactory} from "../value-factories/IPropertyValueFactory";
import {IObjectConverterContextFactory} from "./IObjectConverterContextFactory";
import {IValueIgnoreStrategy} from "../IValueIgnoreStrategy";

export interface IObjectConverterContextFactoryConstructor<TSource, TTarget> {
    new(referenceObjectFactory: Func<TTarget>,
        valueIgnoreStrategy: IValueIgnoreStrategy,
        propertyValueFactories: IReadOnlyDictionary<string, IPropertyValueFactory<TSource, any>>): IObjectConverterContextFactory<TSource, TTarget>;
}
