import {Func} from "../../types";
import {IReadOnlyDictionary} from "../../collections";
import {IPropertyValueFactory} from "../value-factories/IPropertyValueFactory";
import {IObjectConverterContextFactory} from "./IObjectConverterContextFactory";

export interface IObjectConverterContextFactoryConstructor<TSource, TTarget> {
    new(referenceObjectFactory: Func<TTarget>, propertyValueFactories: IReadOnlyDictionary<string, IPropertyValueFactory<TSource, any>>): IObjectConverterContextFactory<TSource, TTarget>;
}
