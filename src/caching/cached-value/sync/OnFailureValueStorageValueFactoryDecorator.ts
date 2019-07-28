import {IValueFactory} from "../IValueFactory";
import {IValueStorage} from "../../../storages/IValueStorage";
import {Action} from "../../../types";
import {TypeUtils} from "../../../utils";
import {getValueFromStorageOrDefault} from "../helpers";

export class OnFailureValueStorageValueFactoryDecorator<T> implements IValueFactory<T> {
    public constructor(private readonly valueFactory: IValueFactory<T>,
                       private readonly valueStorage: IValueStorage<T>,
                       private readonly minValueCreatedOn?: Date,
                       private readonly onFailure?: Action<any>) {
    }

    public createValue(): T {
        try {
            return this.valueFactory.createValue();
        } catch (e) {
            if (!TypeUtils.isNullOrUndefined(this.onFailure)) {
                this.onFailure(e);
            }

            const valueFromStorage = getValueFromStorageOrDefault(this.valueStorage, this.minValueCreatedOn);
            if (!TypeUtils.isNullOrUndefined(valueFromStorage)) {
                return valueFromStorage;
            }

            throw e;
        }
    }
}
