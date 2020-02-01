import {getValueFromStorageOrDefault, IValueFactory} from "../../internal";
import {IValueStorage} from "../../../storages/internal";
import {TypeUtils} from "../../../utils/internal";

export class OnInitValueStorageValueFactoryDecorator<T> implements IValueFactory<T> {
    private _initialized: boolean;

    public constructor(private readonly _valueFactory: IValueFactory<T>,
                       private readonly _valueStorage: IValueStorage<T>,
                       private readonly _minValueCreatedOn?: Date) {
        this._initialized = false;
    }

    public createValue(): T {
        if (!this._initialized) {
            const valueFromStorage = getValueFromStorageOrDefault(this._valueStorage, this._minValueCreatedOn);
            if (!TypeUtils.isNullOrUndefined(valueFromStorage)) {
                return valueFromStorage;
            }

            this._initialized = true;
        }

        return this._valueFactory.createValue();
    }
}
