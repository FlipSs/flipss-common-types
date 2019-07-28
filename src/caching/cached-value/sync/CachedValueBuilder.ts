import {IValueWrapperConstructor} from "../IValueWrapperConstructor";
import {ICachedValueProviderConstructor} from "../ICachedValueProviderConstructor";
import {Action, Func} from "../../../types";
import {TimeSpan} from "../../../time";
import {DirectValueWrapper} from "../DirectValueWrapper";
import {AbsoluteExpirationCachedValueProvider} from "../AbsoluteExpirationCachedValueProvider";
import {LazyValueWrapper} from "../LazyValueWrapper";
import {SlidingExpirationCachedValueProvider} from "../SlidingExpirationCachedValueProvider";
import {ICachedValue} from "./ICachedValue";
import {IValueStorage} from "../../../storages/IValueStorage";
import {Argument} from "../../../utils";
import {IValueFactory} from "../IValueFactory";
import {DirectValueFactory} from "../DirectValueFactory";
import {SaveValueToStorageValueFactoryDecorator} from "./SaveValueToStorageValueFactoryDecorator";
import {OnInitValueStorageValueFactoryDecorator} from "./OnInitValueStorageValueFactoryDecorator";
import {OnFailureValueStorageValueFactoryDecorator} from "./OnFailureValueStorageValueFactoryDecorator";
import {ICachedValueBuilder} from "./ICachedValueBuilder";
import {CachedValue} from "./CachedValue";

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
