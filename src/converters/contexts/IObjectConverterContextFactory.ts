import {IObjectConverterContext} from "./IObjectConverterContext";

export interface IObjectConverterContextFactory<TSource, TTarget> {
    create(): IObjectConverterContext<TSource, TTarget>;
}
