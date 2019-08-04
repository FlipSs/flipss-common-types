import {
    ConstantPropertyValueFactory,
    CreatedPropertyValueFactory,
    DirectPropertyTransferringObjectConverter,
    IgnoreFunctionValueIgnoreStrategy,
    IgnoreNullAndUndefinedValueIgnoreStrategy,
    IObjectConverter,
    IObjectConverterBuilder,
    IObjectConverterContextFactory,
    IObjectConverterContextFactoryConstructor,
    IPropertyValueFactory,
    IValueIgnoreStrategyConstructor,
    ObjectConverter,
    ObjectConverterConvertiblePropertyNames,
    ObjectConverterTypedConvertiblePropertyNames,
    OptionalObjectConverterContextFactory,
    StrictObjectConverterContextFactory,
    TransferredPropertyValueFactory
} from "./internal";
import {Func} from "../types/internal";
import {asEnumerable, Dictionary, Set, IDictionary} from "../collections/internal";
import {Argument} from "../utils/internal";

export class ObjectConverterBuilder<TSource, TTarget> implements IObjectConverterBuilder<TSource, TTarget> {
    private readonly propertyValueFactories: IDictionary<string, IPropertyValueFactory<TSource, any>>;

    private converterFactory: Func<IObjectConverter<TSource, TTarget>, IObjectConverterContextFactory<TSource, TTarget>>;
    private contextFactoryConstructor: IObjectConverterContextFactoryConstructor<TSource, TTarget>;
    private valueIgnoreStrategyConstructor: IValueIgnoreStrategyConstructor;

    public constructor(private readonly referenceObjectFactory: Func<TTarget>) {
        this.propertyValueFactories = new Dictionary<string, IPropertyValueFactory<TSource, any>>();
        this.converterFactory = f => new ObjectConverter(f);
        this.contextFactoryConstructor = OptionalObjectConverterContextFactory;
        this.valueIgnoreStrategyConstructor = IgnoreFunctionValueIgnoreStrategy;
    }

    public create(): IObjectConverter<TSource, TTarget> {
        const valueIgnoreStrategy = new this.valueIgnoreStrategyConstructor();
        const contextFactory = new this.contextFactoryConstructor(this.referenceObjectFactory, valueIgnoreStrategy, this.propertyValueFactories);

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

    public useDirectPropertyTransferring(excludedProperties?: ObjectConverterConvertiblePropertyNames<TSource>[]): IObjectConverterBuilder<TSource, TTarget> {
        const excludedPropertySet = excludedProperties && asEnumerable(excludedProperties).select(p => p as string).toReadOnlySet() || new Set<string>();

        this.converterFactory = f => new DirectPropertyTransferringObjectConverter(f, excludedPropertySet);

        return this;
    }

    public enableStrictMode(): IObjectConverterBuilder<TSource, TTarget> {
        this.contextFactoryConstructor = StrictObjectConverterContextFactory;

        return this;
    }

    public ignoreNullAndUndefinedValues(): IObjectConverterBuilder<TSource, TTarget> {
        this.valueIgnoreStrategyConstructor = IgnoreNullAndUndefinedValueIgnoreStrategy;

        return this;
    }
}
