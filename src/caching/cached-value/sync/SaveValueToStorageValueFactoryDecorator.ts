import {IValueFactory} from "../IValueFactory";
import {IValueStorage} from "../../../storages/IValueStorage";

export class SaveValueToStorageValueFactoryDecorator<T> implements IValueFactory<T> {
    public constructor(private readonly valueFactory: IValueFactory<T>,
                       private readonly valueStorage: IValueStorage<T>) {
    }

    public createValue(): T {
        const value = this.valueFactory.createValue();

        this.valueStorage.set(value);

        return value;
    }
}
