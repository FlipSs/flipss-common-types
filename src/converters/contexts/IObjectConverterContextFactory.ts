import {IObjectConverterContext} from "../internal";

export interface IObjectConverterContextFactory<TSource, TTarget> {
    create(): IObjectConverterContext<TSource, TTarget>;
}
