import {IValueFactory} from "../IValueFactory";
import {IValueStorage} from "../../../storages/IValueStorage";

export class SaveValueToStorageAsyncValueFactoryDecorator<T> implements IValueFactory<Promise<T>> {
    public constructor(private readonly valueFactory: IValueFactory<Promise<T>>,
                       private readonly valueStorage: IValueStorage<T>) {
    }

    public async createValue(): Promise<T> {
        const value = await this.valueFactory.createValue();

        this.valueStorage.set(value);

        return value;
    }
}

