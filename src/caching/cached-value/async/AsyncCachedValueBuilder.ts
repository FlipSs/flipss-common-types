import {
    AbsoluteExpirationCachedValueProvider,
    AsyncCachedValue,
    DirectValueFactory,
    DirectValueWrapper,
    IAsyncCachedValue,
    IAsyncCachedValueBuilder,
    ICachedValueProviderConstructor,
    IValueFactory,
    IValueWrapperConstructor,
    LazyValueWrapper,
    OnFailureValueStorageAsyncValueFactoryDecorator,
    OnInitValueStorageAsyncValueFactoryDecorator,
    SaveValueToStorageAsyncValueFactoryDecorator,
    SlidingExpirationCachedValueProvider
} from "../../internal";
import {Action, Func} from "../../../types/internal";
import {TimeSpan} from "../../../time/internal";
import {IValueStorage} from "../../../storages/internal";
import {Argument} from "../../../utils/internal";

export class AsyncCachedValueBuilder<T> implements IAsyncCachedValueBuilder<T> {
    private valueFactory: IValueFactory<Promise<T>>;
    private valueWrapperConstructor: IValueWrapperConstructor<Promise<T>>;
    private cachedValueProviderConstructor: ICachedValueProviderConstructor<Promise<T>>;

    public constructor(valueFactory: Func<Promise<T>>,
                       private readonly expirationPeriodFactory: Func<TimeSpan>) {
        this.valueFactory = new DirectValueFactory(valueFactory);
        this.valueWrapperConstructor = DirectValueWrapper;
        this.cachedValueProviderConstructor = AbsoluteExpirationCachedValueProvider;
    }

    public create(): IAsyncCachedValue<T> {
        const valueWrapper = new this.valueWrapperConstructor(this.valueFactory);
        const cachedValueProvider = new this.cachedValueProviderConstructor(valueWrapper, this.expirationPeriodFactory);

        return new AsyncCachedValue(cachedValueProvider);
    }

    public useLazy(): IAsyncCachedValueBuilder<T> {
        this.valueWrapperConstructor = LazyValueWrapper;

        return this;
    }

    public useSlidingExpiration(): IAsyncCachedValueBuilder<T> {
        this.cachedValueProviderConstructor = SlidingExpirationCachedValueProvider;

        return this;
    }

    public saveValueToValueStorage(valueStorage: IValueStorage<T>): IAsyncCachedValueBuilder<T> {
        Argument.isNotNullOrUndefined(valueStorage, 'valueStorage');

        this.valueFactory = new SaveValueToStorageAsyncValueFactoryDecorator(this.valueFactory, valueStorage);

        return this;
    }

    public useValueStorageOnFailure(valueStorage: IValueStorage<T>, minStorageValueCreatedOn?: Date, onFailure?: Action<any>): IAsyncCachedValueBuilder<T> {
        Argument.isNotNullOrUndefined(valueStorage, 'valueStorage');

        this.valueFactory = new OnFailureValueStorageAsyncValueFactoryDecorator(this.valueFactory, valueStorage, minStorageValueCreatedOn, onFailure);

        return this;
    }

    public useValueStorageOnInit(valueStorage: IValueStorage<T>, minStorageValueCreatedOn?: Date): IAsyncCachedValueBuilder<T> {
        Argument.isNotNullOrUndefined(valueStorage, 'valueStorage');

        this.valueFactory = new OnInitValueStorageAsyncValueFactoryDecorator(this.valueFactory, valueStorage, minStorageValueCreatedOn);

        return this;
    }
}
