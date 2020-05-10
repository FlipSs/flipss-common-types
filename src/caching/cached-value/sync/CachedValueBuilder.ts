import {
    AbsoluteExpirationCachedValueFactoryWrapperDecorator,
    CachedValue,
    DirectValueFactory,
    DirectValueFactoryWrapper,
    ICachedValue,
    ICachedValueBuilder,
    IExpirationValueFactoryWrapperDecoratorConstructor,
    IValueFactory,
    IValueFactoryWrapperConstructor,
    LazyValueFactoryWrapper,
    OnFailureValueStorageValueFactoryDecorator,
    OnInitValueStorageValueFactoryDecorator,
    SaveValueToStorageValueFactoryDecorator,
    SlidingExpirationCachedValueFactoryWrapperDecorator
} from "../../internal";
import {IValueStorage, MemoryStorage} from "../../../storages/internal";
import {Action, Func} from "../../../types/internal";
import {TimeSpan} from "../../../time/internal";
import {Argument} from "../../../utils/internal";

export class CachedValueBuilder<T> implements ICachedValueBuilder<T> {
    private _valueFactory!: IValueFactory<T>;
    private _valueFactoryWrapperConstructor!: IValueFactoryWrapperConstructor<T>;
    private _expirationValueFactoryWrapperDecoratorConstructor!: IExpirationValueFactoryWrapperDecoratorConstructor<T>;

    public constructor(valueFactory: Func<T>,
                       private readonly _expirationPeriodFactory: Func<TimeSpan>) {
        this._valueFactory = new DirectValueFactory(valueFactory);
        this._valueFactoryWrapperConstructor = DirectValueFactoryWrapper;
        this._expirationValueFactoryWrapperDecoratorConstructor = AbsoluteExpirationCachedValueFactoryWrapperDecorator;
    }

    public create(): ICachedValue<T> {
        const valueFactoryWrapper = new this._valueFactoryWrapperConstructor(this._valueFactory);
        const expirationValueFactoryWrapperDecorator = new this._expirationValueFactoryWrapperDecoratorConstructor(valueFactoryWrapper, this._expirationPeriodFactory);

        return new CachedValue(expirationValueFactoryWrapperDecorator);
    }

    public useLazy(): ICachedValueBuilder<T> {
        this._valueFactoryWrapperConstructor = LazyValueFactoryWrapper;

        return this;
    }

    public useSlidingExpiration(): ICachedValueBuilder<T> {
        this._expirationValueFactoryWrapperDecoratorConstructor = SlidingExpirationCachedValueFactoryWrapperDecorator;

        return this;
    }

    public useMemoryStorageOnFailure(onFailure?: Action<any>): ICachedValueBuilder<T> {
        const storage = new MemoryStorage<T>();

        return this.saveValueToValueStorage(storage).useValueStorageOnFailure(storage, null, onFailure);
    }

    public saveValueToValueStorage(valueStorage: IValueStorage<T>): ICachedValueBuilder<T> {
        Argument.isNotNullOrUndefined(valueStorage, 'valueStorage');

        this._valueFactory = new SaveValueToStorageValueFactoryDecorator(this._valueFactory, valueStorage);

        return this;
    }

    public useValueStorageOnFailure(valueStorage: IValueStorage<T>, minStorageValueCreatedOn?: Date, onFailure?: Action<any>): ICachedValueBuilder<T> {
        Argument.isNotNullOrUndefined(valueStorage, 'valueStorage');

        this._valueFactory = new OnFailureValueStorageValueFactoryDecorator(this._valueFactory, valueStorage, minStorageValueCreatedOn, onFailure);

        return this;
    }

    public useValueStorageOnInit(valueStorage: IValueStorage<T>, minStorageValueCreatedOn?: Date): ICachedValueBuilder<T> {
        Argument.isNotNullOrUndefined(valueStorage, 'valueStorage');

        this._valueFactory = new OnInitValueStorageValueFactoryDecorator(this._valueFactory, valueStorage, minStorageValueCreatedOn);

        return this;
    }
}
