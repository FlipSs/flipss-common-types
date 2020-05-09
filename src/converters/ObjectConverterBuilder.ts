import {
    ConstantPropertyValueFactory,
    CreatedPropertyValueFactory,
    DirectPropertyTransferringObjectConverter,
    IgnoreFunctionNullAndUndefinedValueIgnoreStrategy,
    IgnoreFunctionValueIgnoreStrategy,
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
import {asEnumerable, Dictionary, IDictionary, Set} from "../collections/internal";
import {Argument} from "../utils/internal";
import {IConstructorWithoutParameters} from "../common/IConstructorWithoutParameters";

export function buildObjectConverterUsingConstructor<TSource, TTarget>(referenceObjectConstructor: IConstructorWithoutParameters<TTarget>): IObjectConverterBuilder<TSource, TTarget> {
    Argument.isNotNullOrUndefined(referenceObjectConstructor, 'referenceObjectConstructor');

    return new ObjectConverterBuilder(() => new referenceObjectConstructor());
}

export function buildObjectConverter<TSource, TTarget>(referenceObjectFactory: Func<TTarget>): IObjectConverterBuilder<TSource, TTarget> {
    Argument.isNotNullOrUndefined(referenceObjectFactory, 'referenceObjectFactory');

    return new ObjectConverterBuilder(referenceObjectFactory);
}

export class ObjectConverterBuilder<TSource, TTarget> implements IObjectConverterBuilder<TSource, TTarget> {
    private readonly _propertyValueFactories!: IDictionary<string, IPropertyValueFactory<TSource, any>>;

    private _converterFactory!: Func<IObjectConverter<TSource, TTarget>, IObjectConverterContextFactory<TSource, TTarget>>;
    private _contextFactoryConstructor!: IObjectConverterContextFactoryConstructor<TSource, TTarget>;
    private _valueIgnoreStrategyConstructor!: IValueIgnoreStrategyConstructor;

    public constructor(private readonly _referenceObjectFactory: Func<TTarget>) {
        this._propertyValueFactories = new Dictionary<string, IPropertyValueFactory<TSource, any>>();
        this._converterFactory = f => new ObjectConverter(f);
        this._contextFactoryConstructor = OptionalObjectConverterContextFactory;
        this._valueIgnoreStrategyConstructor = IgnoreFunctionValueIgnoreStrategy;
    }

    public create(): IObjectConverter<TSource, TTarget> {
        const valueIgnoreStrategy = new this._valueIgnoreStrategyConstructor();
        const contextFactory = new this._contextFactoryConstructor(this._referenceObjectFactory, valueIgnoreStrategy, this._propertyValueFactories);

        return this._converterFactory(contextFactory);
    }

    public set<TValue>(valueFactory: Func<TValue, Readonly<TSource>>, targetPropertyName: ObjectConverterTypedConvertiblePropertyNames<TTarget, TValue>): IObjectConverterBuilder<TSource, TTarget> {
        const targetPropertyNameString = targetPropertyName as string;

        Argument.isNotNullOrUndefined(valueFactory, 'valueFactory');
        Argument.isNotNullOrEmpty(targetPropertyNameString, 'targetPropertyName');

        this._propertyValueFactories.set(targetPropertyNameString, new CreatedPropertyValueFactory(valueFactory));

        return this;
    }

    public setConstant<TValue>(value: TValue, targetPropertyName: ObjectConverterTypedConvertiblePropertyNames<TTarget, TValue>): IObjectConverterBuilder<TSource, TTarget> {
        const targetPropertyNameString = targetPropertyName as string;

        Argument.isNotNullOrUndefined(value, 'value');
        Argument.isNotNullOrEmpty(targetPropertyNameString, 'targetPropertyName');

        this._propertyValueFactories.set(targetPropertyNameString, new ConstantPropertyValueFactory(value));

        return this;
    }

    public setProperty<TValue>(sourcePropertyName: ObjectConverterTypedConvertiblePropertyNames<TSource, TValue>, targetPropertyName: ObjectConverterTypedConvertiblePropertyNames<TTarget, TValue>): IObjectConverterBuilder<TSource, TTarget> {
        const sourcePropertyNameString = sourcePropertyName as string;
        const targetPropertyNameString = targetPropertyName as string;

        Argument.isNotNullOrEmpty(sourcePropertyNameString, 'sourcePropertyName');
        Argument.isNotNullOrEmpty(targetPropertyNameString, 'targetPropertyName');

        this._propertyValueFactories.set(targetPropertyNameString, new TransferredPropertyValueFactory(sourcePropertyNameString));

        return this;
    }

    public useDirectPropertyTransferring(excludedProperties?: ObjectConverterConvertiblePropertyNames<TSource>[], sourcePropertyNameFactory?: Func<string, string>): IObjectConverterBuilder<TSource, TTarget> {
        const excludedPropertySet = excludedProperties && asEnumerable(excludedProperties).select(p => p as string).toReadOnlySet() || new Set<string>();

        this._converterFactory = f => new DirectPropertyTransferringObjectConverter(f, excludedPropertySet, sourcePropertyNameFactory);

        return this;
    }

    public enableStrictMode(): IObjectConverterBuilder<TSource, TTarget> {
        this._contextFactoryConstructor = StrictObjectConverterContextFactory;

        return this;
    }

    public ignoreNullAndUndefinedValues(): IObjectConverterBuilder<TSource, TTarget> {
        this._valueIgnoreStrategyConstructor = IgnoreFunctionNullAndUndefinedValueIgnoreStrategy;

        return this;
    }
}
