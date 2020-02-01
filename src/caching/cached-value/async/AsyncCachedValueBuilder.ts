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
    private _valueFactory!: IValueFactory<Promise<T>>;
    private _valueWrapperConstructor!: IValueFactoryWrapperConstructor<Promise<T>>;
    private _expirationValueFactoryWrapperDecoratorConstructor!: IExpirationValueFactoryWrapperDecoratorConstructor<Promise<T>>;

    public constructor(valueFactory: Func<Promise<T>>,
                       private readonly _expirationPeriodFactory: Func<TimeSpan>) {
        this._valueFactory = new DirectValueFactory(valueFactory);
        this._valueWrapperConstructor = DirectValueFactoryWrapper;
        this._expirationValueFactoryWrapperDecoratorConstructor = AbsoluteExpirationCachedValueFactoryWrapperDecorator;
    }

    public create(): IAsyncCachedValue<T> {
        const valueWrapper = new this._valueWrapperConstructor(this._valueFactory);
        const expirationValueFactoryWrapperDecorator = new this._expirationValueFactoryWrapperDecoratorConstructor(valueWrapper, this._expirationPeriodFactory);

        const cachedValue = new CachedValue(expirationValueFactoryWrapperDecorator);

        return new AsyncCachedValue(cachedValue);
    }

    public useLazy(): IAsyncCachedValueBuilder<T> {
        this._valueWrapperConstructor = LazyValueFactoryWrapper;

        return this;
    }

    public useSlidingExpiration(): IAsyncCachedValueBuilder<T> {
        this._expirationValueFactoryWrapperDecoratorConstructor = SlidingExpirationCachedValueFactoryWrapperDecorator;

        return this;
    }

    public saveValueToValueStorage(valueStorage: IValueStorage<T>): IAsyncCachedValueBuilder<T> {
        Argument.isNotNullOrUndefined(valueStorage, 'valueStorage');

        this._valueFactory = new SaveValueToStorageAsyncValueFactoryDecorator(this._valueFactory, valueStorage);

        return this;
    }

    public useValueStorageOnFailure(valueStorage: IValueStorage<T>, minStorageValueCreatedOn?: Date, onFailure?: Action<any>): IAsyncCachedValueBuilder<T> {
        Argument.isNotNullOrUndefined(valueStorage, 'valueStorage');

        this._valueFactory = new OnFailureValueStorageAsyncValueFactoryDecorator(this._valueFactory, valueStorage, minStorageValueCreatedOn, onFailure);

        return this;
    }

    public useValueStorageOnInit(valueStorage: IValueStorage<T>, minStorageValueCreatedOn?: Date): IAsyncCachedValueBuilder<T> {
        Argument.isNotNullOrUndefined(valueStorage, 'valueStorage');

        this._valueFactory = new OnInitValueStorageAsyncValueFactoryDecorator(this._valueFactory, valueStorage, minStorageValueCreatedOn);

        return this;
    }
}
