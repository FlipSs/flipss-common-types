import {
    AbsoluteExpirationCachedValueProvider,
    CachedValue,
    DirectValueFactory,
    DirectValueWrapper,
    ICachedValue,
    ICachedValueBuilder,
    ICachedValueProviderConstructor,
    IValueFactory,
    IValueWrapperConstructor,
    LazyValueWrapper,
    OnFailureValueStorageValueFactoryDecorator,
    OnInitValueStorageValueFactoryDecorator,
    SaveValueToStorageValueFactoryDecorator,
    SlidingExpirationCachedValueProvider
} from "../../internal";
import {IValueStorage} from "../../../storages/internal";
import {Action, Func} from "../../../types/internal";
import {TimeSpan} from "../../../time/internal";
import {Argument} from "../../../utils/internal";

export class CachedValueBuilder<T> implements ICachedValueBuilder<T> {
    private valueFactory: IValueFactory<T>;
    private valueWrapperConstructor: IValueWrapperConstructor<T>;
    private cachedValueProviderConstructor: ICachedValueProviderConstructor<T>;

    public constructor(valueFactory: Func<T>,
                       private readonly expirationPeriodFactory: Func<TimeSpan>) {
        this.valueFactory = new DirectValueFactory(valueFactory);
        this.valueWrapperConstructor = DirectValueWrapper;
        this.cachedValueProviderConstructor = AbsoluteExpirationCachedValueProvider;
    }

    public create(): ICachedValue<T> {
        const valueWrapper = new this.valueWrapperConstructor(this.valueFactory);
        const cachedValueProvider = new this.cachedValueProviderConstructor(valueWrapper, this.expirationPeriodFactory);

        return new CachedValue(cachedValueProvider);
    }

    public useLazy(): ICachedValueBuilder<T> {
        this.valueWrapperConstructor = LazyValueWrapper;

        return this;
    }

    public useSlidingExpiration(): ICachedValueBuilder<T> {
        this.cachedValueProviderConstructor = SlidingExpirationCachedValueProvider;

        return this;
    }

    public saveValueToValueStorage(valueStorage: IValueStorage<T>): ICachedValueBuilder<T> {
        Argument.isNotNullOrUndefined(valueStorage, 'valueStorage');

        this.valueFactory = new SaveValueToStorageValueFactoryDecorator(this.valueFactory, valueStorage);

        return this;
    }

    public useValueStorageOnFailure(valueStorage: IValueStorage<T>, minStorageValueCreatedOn?: Date, onFailure?: Action<any>): ICachedValueBuilder<T> {
        Argument.isNotNullOrUndefined(valueStorage, 'valueStorage');

        this.valueFactory = new OnFailureValueStorageValueFactoryDecorator(this.valueFactory, valueStorage, minStorageValueCreatedOn, onFailure);

        return this;
    }

    public useValueStorageOnInit(valueStorage: IValueStorage<T>, minStorageValueCreatedOn?: Date): ICachedValueBuilder<T> {
        Argument.isNotNullOrUndefined(valueStorage, 'valueStorage');

        this.valueFactory = new OnInitValueStorageValueFactoryDecorator(this.valueFactory, valueStorage, minStorageValueCreatedOn);

        return this;
    }
}
