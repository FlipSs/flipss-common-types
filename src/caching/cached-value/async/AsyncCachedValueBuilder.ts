import {
    AbsoluteExpirationCachedValueFactoryWrapperDecorator,
    AsyncCachedValue,
    CachedValue,
    DirectValueFactory,
    DirectValueFactoryWrapper,
    IAsyncCachedValue,
    IAsyncCachedValueBuilder,
    IExpirationValueFactoryWrapperDecoratorConstructor,
    IValueFactory,
    IValueFactoryWrapperConstructor,
    LazyValueFactoryWrapper,
    OnFailureValueStorageAsyncValueFactoryDecorator,
    OnInitValueStorageAsyncValueFactoryDecorator,
    SaveValueToStorageAsyncValueFactoryDecorator,
    SlidingExpirationCachedValueFactoryWrapperDecorator
} from "../../internal";
import {Action, Func} from "../../../types/internal";
import {TimeSpan} from "../../../time/internal";
import {IValueStorage} from "../../../storages/internal";
import {Argument} from "../../../utils/internal";

export class AsyncCachedValueBuilder<T> implements IAsyncCachedValueBuilder<T> {
    private valueFactory: IValueFactory<Promise<T>>;
    private valueWrapperConstructor: IValueFactoryWrapperConstructor<Promise<T>>;
    private expirationValueFactoryWrapperDecoratorConstructor: IExpirationValueFactoryWrapperDecoratorConstructor<Promise<T>>;

    public constructor(valueFactory: Func<Promise<T>>,
                       private readonly expirationPeriodFactory: Func<TimeSpan>) {
        this.valueFactory = new DirectValueFactory(valueFactory);
        this.valueWrapperConstructor = DirectValueFactoryWrapper;
        this.expirationValueFactoryWrapperDecoratorConstructor = AbsoluteExpirationCachedValueFactoryWrapperDecorator;
    }

    public create(): IAsyncCachedValue<T> {
        const valueWrapper = new this.valueWrapperConstructor(this.valueFactory);
        const expirationValueFactoryWrapperDecorator = new this.expirationValueFactoryWrapperDecoratorConstructor(valueWrapper, this.expirationPeriodFactory);

        const cachedValue = new CachedValue(expirationValueFactoryWrapperDecorator);

        return new AsyncCachedValue(cachedValue);
    }

    public useLazy(): IAsyncCachedValueBuilder<T> {
        this.valueWrapperConstructor = LazyValueFactoryWrapper;

        return this;
    }

    public useSlidingExpiration(): IAsyncCachedValueBuilder<T> {
        this.expirationValueFactoryWrapperDecoratorConstructor = SlidingExpirationCachedValueFactoryWrapperDecorator;

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
