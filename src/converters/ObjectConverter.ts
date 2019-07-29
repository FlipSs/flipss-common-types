import {IObjectConverter} from "./IObjectConverter";
import {IObjectConverterContextFactory} from "./contexts/IObjectConverterContextFactory";
import {IObjectConverterContext} from "./contexts/IObjectConverterContext";
import {Argument} from "../utils";

export class ObjectConverter<TSource, TTarget> implements IObjectConverter<TSource, TTarget> {
    public constructor(private readonly contextFactory: IObjectConverterContextFactory<TSource, TTarget>) {
    }

    public convert(source: TSource): TTarget {
        Argument.isNotNullOrUndefined(source, 'source');

        const context = this.contextFactory.create();

        const resultValue = this.getReferenceObject(context, source);

        context.propertyValueFactories.forEach(kv => resultValue[kv.key] = kv.value.create(source));

        return resultValue;
    }

    protected getReferenceObject(context: IObjectConverterContext<TSource, TTarget>, source: TSource): TTarget {
        return context.referenceObject;
    }
}

