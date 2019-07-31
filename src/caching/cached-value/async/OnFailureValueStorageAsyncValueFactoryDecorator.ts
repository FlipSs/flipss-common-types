import {getValueFromStorageOrDefault, IValueFactory} from "../../internal";
import {IValueStorage} from "../../../storages/internal";
import {Action} from "../../../types/internal";
import {TypeUtils} from "../../../utils/internal";

export class OnFailureValueStorageAsyncValueFactoryDecorator<T> implements IValueFactory<Promise<T>> {
    public constructor(private readonly valueFactory: IValueFactory<Promise<T>>,
                       private readonly valueStorage: IValueStorage<T>,
                       private readonly minValueCreatedOn?: Date,
                       private readonly onFailure?: Action<any>) {
    }

    public async createValue(): Promise<T> {
        try {
            return await this.valueFactory.createValue();
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
