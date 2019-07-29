import {IObjectConverterContextFactory} from "./contexts/IObjectConverterContextFactory";
import {IReadOnlyHashSet} from "../collections";
import {IObjectConverterContext} from "./contexts/IObjectConverterContext";
import {ObjectConverter} from "./ObjectConverter";

export class DirectMappingObjectConverter<TSource, TTarget> extends ObjectConverter<TSource, TTarget> {
    public constructor(contextFactory: IObjectConverterContextFactory<TSource, TTarget>,
                       private readonly excludedPropertyNames: IReadOnlyHashSet<string>) {
        super(contextFactory);
    }

    protected getReferenceObject(context: IObjectConverterContext<TSource, TTarget>, source: TSource): TTarget {
        const referenceObject = super.getReferenceObject(context, source);

        const propertyNames = context.propertyValueFactories.keys
            .where(k => !this.excludedPropertyNames.has(k))
            .toArray();

        for (const propertyName of propertyNames) {
            if (source.hasOwnProperty(propertyName)) {
                //check property types somehow
                referenceObject[propertyName] = source[propertyName];
            }
        }

        return referenceObject;
    }
}
