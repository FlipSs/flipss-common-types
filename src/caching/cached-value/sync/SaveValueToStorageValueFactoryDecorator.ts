import {IValueFactory} from "../../internal";
import {IValueStorage} from "../../../storages/internal";

export class SaveValueToStorageValueFactoryDecorator<T> implements IValueFactory<T> {
    public constructor(private readonly _valueFactory: IValueFactory<T>,
                       private readonly _valueStorage: IValueStorage<T>) {
    }

    public createValue(): T {
        const value = this._valueFactory.createValue();

        this._valueStorage.set(value);

        return value;
    }
}
