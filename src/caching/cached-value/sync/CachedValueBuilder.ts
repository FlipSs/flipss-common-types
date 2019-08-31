import {
    AbsoluteExpirationCachedValueProvider,
    CachedValue,
    DirectValueFactory,
    DirectValueFactoryWrapper,
    ICachedValue,
    ICachedValueBuilder,
    ICachedValueProviderConstructor,
    IValueFactory,
    IValueFactoryWrapperConstructor,
    LazyValueFactoryWrapper,
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
    private valueFactoryWrapperConstructor: IValueFactoryWrapperConstructor<T>;
    private cachedValueProviderConstructor: ICachedValueProviderConstructor<T>;

    public constructor(valueFactory: Func<T>,
                       private readonly expirationPeriodFactory: Func<TimeSpan>) {
        this.valueFactory = new DirectValueFactory(valueFactory);
        this.valueFactoryWrapperConstructor = DirectValueFactoryWrapper;
        this.cachedValueProviderConstructor = AbsoluteExpirationCachedValueProvider;
    }

    public create(): ICachedValue<T> {
        const valueFactoryWrapper = new this.valueFactoryWrapperConstructor(this.valueFactory);
        const cachedValueProvider = new this.cachedValueProviderConstructor(valueFactoryWrapper, this.expirationPeriodFactory);

        return new CachedValue(cachedValueProvider);
    }

    public useLazy(): ICachedValueBuilder<T> {
        this.valueFactoryWrapperConstructor = LazyValueFactoryWrapper;

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
