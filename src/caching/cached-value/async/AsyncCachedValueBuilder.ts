import {IValueFactory} from "../IValueFactory";
import {IValueWrapperConstructor} from "../IValueWrapperConstructor";
import {ICachedValueProviderConstructor} from "../ICachedValueProviderConstructor";
import {Action, Func} from "../../../types";
import {TimeSpan} from "../../../time";
import {DirectValueFactory} from "../DirectValueFactory";
import {DirectValueWrapper} from "../DirectValueWrapper";
import {AbsoluteExpirationCachedValueProvider} from "../AbsoluteExpirationCachedValueProvider";
import {IAsyncCachedValue} from "./IAsyncCachedValue";
import {AsyncCachedValue} from "./AsyncCachedValue";
import {LazyValueWrapper} from "../LazyValueWrapper";
import {SlidingExpirationCachedValueProvider} from "../SlidingExpirationCachedValueProvider";
import {IValueStorage} from "../../../storages/IValueStorage";
import {Argument} from "../../../utils";
import {SaveValueToStorageAsyncValueFactoryDecorator} from "./SaveValueToStorageAsyncValueFactoryDecorator";
import {OnFailureValueStorageAsyncValueFactoryDecorator} from "./OnFailureValueStorageAsyncValueFactoryDecorator";
import {OnInitValueStorageAsyncValueFactoryDecorator} from "./OnInitValueStorageAsyncValueFactoryDecorator";
import {IAsyncCachedValueBuilder} from "./IAsyncCachedValueBuilder";

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
