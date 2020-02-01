import {getValueFromStorageOrDefault, IValueFactory} from "../../internal";
import {IValueStorage} from "../../../storages/internal";
import {Action} from "../../../types/internal";
import {TypeUtils} from "../../../utils/internal";

export class OnFailureValueStorageAsyncValueFactoryDecorator<T> implements IValueFactory<Promise<T>> {
    public constructor(private readonly _valueFactory: IValueFactory<Promise<T>>,
                       private readonly _valueStorage: IValueStorage<T>,
                       private readonly _minValueCreatedOn?: Date,
                       private readonly _onFailure?: Action<any>) {
    }

    public async createValue(): Promise<T> {
        try {
            return await this._valueFactory.createValue();
        } catch (e) {
            if (!TypeUtils.isNullOrUndefined(this._onFailure)) {
                this._onFailure(e);
            }

            const valueFromStorage = getValueFromStorageOrDefault(this._valueStorage, this._minValueCreatedOn);
            if (!TypeUtils.isNullOrUndefined(valueFromStorage)) {
                return valueFromStorage;
            }

            throw e;
        }
    }
}
