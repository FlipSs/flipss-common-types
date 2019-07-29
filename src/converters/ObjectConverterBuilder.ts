import {IObjectConverterBuilder} from "./IObjectConverterBuilder";
import {Func} from "../types";
import {ObjectConverterConvertiblePropertyNames, ObjectConverterTypedConvertiblePropertyNames} from "./types";
import {IObjectConverter} from "./IObjectConverter";
import {asEnumerable, Dictionary, HashSet, IDictionary} from "../collections";
import {Argument} from "../utils";
import {IPropertyValueFactory} from "./value-factories/IPropertyValueFactory";
import {ConstantPropertyValueFactory} from "./value-factories/ConstantPropertyValueFactory";
import {CreatedPropertyValueFactory} from "./value-factories/CreatedPropertyValueFactory";
import {TransferredPropertyValueFactory} from "./value-factories/TransferredPropertyValueFactory";
import {ObjectConverter} from "./ObjectConverter";
import {IObjectConverterContextFactoryConstructor} from "./contexts/IObjectConverterContextFactoryConstructor";
import {OptionalObjectConverterContextFactory} from "./contexts/OptionalObjectConverterContextFactory";
import {StrictObjectConverterContextFactory} from "./contexts/StrictObjectConverterContextFactory";
import {IObjectConverterContextFactory} from "./contexts/IObjectConverterContextFactory";
import {DirectMappingObjectConverter} from "./DirectMappingObjectConverter";

export class ObjectConverterBuilder<TSource, TTarget> implements IObjectConverterBuilder<TSource, TTarget> {
    private readonly propertyValueFactories: IDictionary<string, IPropertyValueFactory<TSource, any>>;

    private converterFactory: Func<IObjectConverter<TSource, TTarget>, IObjectConverterContextFactory<TSource, TTarget>>;
    private contextFactoryConstructor: IObjectConverterContextFactoryConstructor<TSource, TTarget>;

    public constructor(private readonly referenceObjectFactory: Func<TTarget>) {
        this.propertyValueFactories = new Dictionary<string, IPropertyValueFactory<TSource, any>>();
        this.converterFactory = f => new ObjectConverter(f);
        this.contextFactoryConstructor = OptionalObjectConverterContextFactory;
    }

    public create(): IObjectConverter<TSource, TTarget> {
        const contextFactory = new this.contextFactoryConstructor(this.referenceObjectFactory, this.propertyValueFactories);

        return this.converterFactory(contextFactory);
    }

    public set<TValue>(valueFactory: Func<TValue, Readonly<TSource>>, targetPropertyName: ObjectConverterTypedConvertiblePropertyNames<TTarget, TValue>): IObjectConverterBuilder<TSource, TTarget> {
        const targetPropertyNameString = targetPropertyName as string;

        Argument.isNotNullOrUndefined(valueFactory, 'valueFactory');
        Argument.isNotNullOrEmpty(targetPropertyNameString, 'targetPropertyName');

        this.propertyValueFactories.set(targetPropertyNameString, new CreatedPropertyValueFactory(valueFactory));

        return this;
    }

    public setConstant<TValue>(value: TValue, targetPropertyName: ObjectConverterTypedConvertiblePropertyNames<TTarget, TValue>): IObjectConverterBuilder<TSource, TTarget> {
        const targetPropertyNameString = targetPropertyName as string;

        Argument.isNotNullOrUndefined(value, 'value');
        Argument.isNotNullOrEmpty(targetPropertyNameString, 'targetPropertyName');

        this.propertyValueFactories.set(targetPropertyNameString, new ConstantPropertyValueFactory(value));

        return this;
    }

    public setProperty<TValue>(sourcePropertyName: ObjectConverterTypedConvertiblePropertyNames<TSource, TValue>, targetPropertyName: ObjectConverterTypedConvertiblePropertyNames<TTarget, TValue>): IObjectConverterBuilder<TSource, TTarget> {
        const sourcePropertyNameString = sourcePropertyName as string;
        const targetPropertyNameString = targetPropertyName as string;

        Argument.isNotNullOrEmpty(sourcePropertyNameString, 'sourcePropertyName');
        Argument.isNotNullOrEmpty(targetPropertyNameString, 'targetPropertyName');

        this.propertyValueFactories.set(targetPropertyNameString, new TransferredPropertyValueFactory(sourcePropertyNameString));

        return this;
    }

    public useDirectMapping(excludedProperties?: ObjectConverterConvertiblePropertyNames<TSource>[]): IObjectConverterBuilder<TSource, TTarget> {
        const excludedPropertySet = excludedProperties && asEnumerable(excludedProperties).select(p => p as string).toReadOnlyHashSet() || new HashSet<string>();

        this.converterFactory = f => new DirectMappingObjectConverter(f, excludedPropertySet);

        return this;
    }

    public enableStrictMode(): IObjectConverterBuilder<TSource, TTarget> {
        this.contextFactoryConstructor = StrictObjectConverterContextFactory;

        return this;
    }
}
