import {IObjectConverter, IObjectConverterContext, IObjectConverterContextFactory} from "./internal";
import {Argument} from "../utils/internal";

export class ObjectConverter<TSource, TTarget> implements IObjectConverter<TSource, TTarget> {
    public constructor(private readonly contextFactory: IObjectConverterContextFactory<TSource, TTarget>) {
    }

    public convert(source: TSource): TTarget {
        Argument.isNotNullOrUndefined(source, 'source');

        const context = this.contextFactory.create();
        const resultValue = this.getReferenceObject(context, source);

        for (const propertyValueFactory of context.propertyValueFactories) {
            const value = propertyValueFactory.value.create(source);
            if (context.valueIgnoreStrategy.needToIgnore(value)) {
                continue;
            }

            resultValue[propertyValueFactory.key] = value;
        }

        return resultValue;
    }

    protected getReferenceObject(context: IObjectConverterContext<TSource, TTarget>, source: Readonly<TSource>): TTarget {
        return context.referenceObject;
    }
}

