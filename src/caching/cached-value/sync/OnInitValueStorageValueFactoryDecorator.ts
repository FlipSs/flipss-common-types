import {IValueFactory} from "../IValueFactory";
import {IValueStorage} from "../../../storages/IValueStorage";
import {TypeUtils} from "../../../utils";
import {getValueFromStorageOrDefault} from "../helpers";

export class OnInitValueStorageValueFactoryDecorator<T> implements IValueFactory<T> {
    private initialized: boolean;

    public constructor(private readonly valueFactory: IValueFactory<T>,
                       private readonly valueStorage: IValueStorage<T>,
                       private readonly minValueCreatedOn?: Date) {
        this.initialized = true;
    }

    public createValue(): T {
        if (!this.initialized) {
            const valueFromStorage = getValueFromStorageOrDefault(this.valueStorage, this.minValueCreatedOn);
            if (!TypeUtils.isNullOrUndefined(valueFromStorage)) {
                return valueFromStorage;
            }

            this.initialized = true;
        }

        return this.valueFactory.createValue();
    }
}
