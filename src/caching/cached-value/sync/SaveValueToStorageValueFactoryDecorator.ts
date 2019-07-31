import {IValueFactory} from "../../internal";
import {IValueStorage} from "../../../storages/internal";

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
