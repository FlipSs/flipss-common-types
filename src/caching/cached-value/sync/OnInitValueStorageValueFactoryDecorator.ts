import {getValueFromStorageOrDefault, IValueFactory} from "../../internal";
import {IValueStorage} from "../../../storages/internal";
import {TypeUtils} from "../../../utils/internal";

export class OnInitValueStorageValueFactoryDecorator<T> implements IValueFactory<T> {
    private initialized: boolean;

    public constructor(private readonly valueFactory: IValueFactory<T>,
                       private readonly valueStorage: IValueStorage<T>,
                       private readonly minValueCreatedOn?: Date) {
        this.initialized = false;
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
