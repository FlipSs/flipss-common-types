import {IObjectConverterContextFactory} from "./contexts/IObjectConverterContextFactory";
import {IReadOnlyHashSet} from "../collections";
import {IObjectConverterContext} from "./contexts/IObjectConverterContext";
import {ObjectConverter} from "./ObjectConverter";
import {TypeUtils} from "../utils";
import {getAvailablePropertyNames} from "./helpers";
import {IValueIgnoreStrategy} from "./IValueIgnoreStrategy";

export class DirectPropertyTransferringObjectConverter<TSource, TTarget> extends ObjectConverter<TSource, TTarget> {
    public constructor(contextFactory: IObjectConverterContextFactory<TSource, TTarget>,
                       private readonly excludedPropertyNames: IReadOnlyHashSet<string>) {
        super(contextFactory);
    }

    protected getReferenceObject(context: IObjectConverterContext<TSource, TTarget>, source: Readonly<TSource>): TTarget {
        const referenceObject = super.getReferenceObject(context, source);

        context.propertyValueFactories.keys
            .where(k => !this.excludedPropertyNames.has(k))
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

    if (isPrimitiveType(sourcePropertyValueType)) {
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

function isPrimitiveType(type: string): boolean {
    return type !== 'function' && type !== 'object';
}
