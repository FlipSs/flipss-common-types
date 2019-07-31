import {getValueFromStorageOrDefault, IValueFactory} from "../../internal";
import {IValueStorage} from "../../../storages/internal";
import {TypeUtils} from "../../../utils/internal";

export class OnInitValueStorageAsyncValueFactoryDecorator<T> implements IValueFactory<Promise<T>> {
    private initialized: boolean;

    public constructor(private readonly valueFactory: IValueFactory<Promise<T>>,
                       private readonly valueStorage: IValueStorage<T>,
                       private readonly minValueCreatedOn?: Date) {
        this.initialized = true;
    }

    public createValue(): Promise<T> {
        if (!this.initialized) {
            const valueFromStorage = getValueFromStorageOrDefault(this.valueStorage, this.minValueCreatedOn);
            if (!TypeUtils.isNullOrUndefined(valueFromStorage)) {
                return Promise.resolve(valueFromStorage);
            }

            this.initialized = true;
        }

        return this.valueFactory.createValue();
    }
}
