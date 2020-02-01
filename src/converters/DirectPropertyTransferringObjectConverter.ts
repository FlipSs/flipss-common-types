import {
    getAvailablePropertyNames,
    IObjectConverterContext,
    IObjectConverterContextFactory,
    IValueIgnoreStrategy,
    ObjectConverter
} from "./internal";
import {IReadOnlySet} from "../collections/internal";
import {TypeUtils} from "../utils/internal";

export class DirectPropertyTransferringObjectConverter<TSource, TTarget> extends ObjectConverter<TSource, TTarget> {
    public constructor(contextFactory: IObjectConverterContextFactory<TSource, TTarget>,
                       private readonly _excludedPropertyNames: IReadOnlySet<string>) {
        super(contextFactory);
    }

    protected getReferenceObject(context: IObjectConverterContext<TSource, TTarget>, source: Readonly<TSource>): TTarget {
        const referenceObject = super.getReferenceObject(context, source);

        context.availablePropertyNames
            .where(k => !this._excludedPropertyNames.has(k))
            .forEach(p => setPropertyValueRecursive(p, source, referenceObject, context.valueIgnoreStrategy));

        return referenceObject;
    }
}

function setPropertyValueRecursive(propertyName: string, sourceObject: any, targetObject: any, valueIgnoreStrategy: IValueIgnoreStrategy): void {
    if (!sourceObject.hasOwnProperty(propertyName)) {
        return;
    }

    const sourcePropertyValue = sourceObject[propertyName];
    if (valueIgnoreStrategy.needToIgnore(sourcePropertyValue)) {
        return;
    }

    if (TypeUtils.isNullOrUndefined(sourcePropertyValue)) {
        targetObject[propertyName] = sourcePropertyValue;

        return;
    }

    const sourcePropertyValueType = typeof sourcePropertyValue;

    const targetObjectPropertyValue = targetObject[propertyName];
    const referenceObjectPropertyValueType = typeof targetObjectPropertyValue;

    if (sourcePropertyValueType !== referenceObjectPropertyValueType) {
        return;
    }

    if (sourcePropertyValueType !== 'object') {
        targetObject[propertyName] = sourcePropertyValue;

        return;
    }

    const sourcePropertyValuePrototype = Object.getPrototypeOf(sourcePropertyValue);
    const targetObjectPropertyValuePrototype = Object.getPrototypeOf(targetObjectPropertyValue);
    if (sourcePropertyValuePrototype !== targetObjectPropertyValuePrototype) {
        return;
    }

    if (sourcePropertyValuePrototype.constructor !== Object) {
        targetObject[propertyName] = sourcePropertyValue;

        return;
    }

    getAvailablePropertyNames(targetObjectPropertyValue).forEach(p => setPropertyValueRecursive(p, sourcePropertyValue, targetObjectPropertyValue, valueIgnoreStrategy));
}
