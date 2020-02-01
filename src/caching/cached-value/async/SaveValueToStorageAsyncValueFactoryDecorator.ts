import {IValueFactory} from "../../internal";
import {IValueStorage} from "../../../storages/internal";

export class SaveValueToStorageAsyncValueFactoryDecorator<T> implements IValueFactory<Promise<T>> {
    public constructor(private readonly _valueFactory: IValueFactory<Promise<T>>,
                       private readonly _valueStorage: IValueStorage<T>) {
    }

    public async createValue(): Promise<T> {
        const value = await this._valueFactory.createValue();

        this._valueStorage.set(value);

        return value;
    }
}

