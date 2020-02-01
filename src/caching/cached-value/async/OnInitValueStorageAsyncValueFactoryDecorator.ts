import {getValueFromStorageOrDefault, IValueFactory} from "../../internal";
import {IValueStorage} from "../../../storages/internal";
import {TypeUtils} from "../../../utils/internal";

export class OnInitValueStorageAsyncValueFactoryDecorator<T> implements IValueFactory<Promise<T>> {
    private _initialized: boolean;

    public constructor(private readonly _valueFactory: IValueFactory<Promise<T>>,
                       private readonly _valueStorage: IValueStorage<T>,
                       private readonly _minValueCreatedOn?: Date) {
        this._initialized = false;
    }

    public createValue(): Promise<T> {
        if (!this._initialized) {
            const valueFromStorage = getValueFromStorageOrDefault(this._valueStorage, this._minValueCreatedOn);
            if (!TypeUtils.isNullOrUndefined(valueFromStorage)) {
                return Promise.resolve(valueFromStorage);
            }

            this._initialized = true;
        }

        return this._valueFactory.createValue();
    }
}
