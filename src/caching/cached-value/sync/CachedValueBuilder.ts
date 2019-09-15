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
import {IValueStorage} from "../../../storages/internal";
import {Action, Func} from "../../../types/internal";
import {TimeSpan} from "../../../time/internal";
import {Argument} from "../../../utils/internal";

export class CachedValueBuilder<T> implements ICachedValueBuilder<T> {
    private valueFactory: IValueFactory<T>;
    private valueFactoryWrapperConstructor: IValueFactoryWrapperConstructor<T>;
    private expirationValueFactoryWrapperDecoratorConstructor: IExpirationValueFactoryWrapperDecoratorConstructor<T>;

    public constructor(valueFactory: Func<T>,
                       private readonly expirationPeriodFactory: Func<TimeSpan>) {
        this.valueFactory = new DirectValueFactory(valueFactory);
        this.valueFactoryWrapperConstructor = DirectValueFactoryWrapper;
        this.expirationValueFactoryWrapperDecoratorConstructor = AbsoluteExpirationCachedValueFactoryWrapperDecorator;
    }

    public create(): ICachedValue<T> {
        const valueFactoryWrapper = new this.valueFactoryWrapperConstructor(this.valueFactory);
        const expirationValueFactoryWrapperDecorator = new this.expirationValueFactoryWrapperDecoratorConstructor(valueFactoryWrapper, this.expirationPeriodFactory);

        return new CachedValue(expirationValueFactoryWrapperDecorator);
    }

    public useLazy(): ICachedValueBuilder<T> {
        this.valueFactoryWrapperConstructor = LazyValueFactoryWrapper;

        return this;
    }

    public useSlidingExpiration(): ICachedValueBuilder<T> {
        this.expirationValueFactoryWrapperDecoratorConstructor = SlidingExpirationCachedValueFactoryWrapperDecorator;

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
