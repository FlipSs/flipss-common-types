import {IJsonSerializer} from "../json/IJsonSerializer";
import {Argument, TypeUtils} from "../utils";
import {JsonSerializer} from "../json/JsonSerializer";
import {IValueStorage} from "./IValueStorage";
import {IStorageValue} from "./IStorageValue";

export function isLocalStorageSupported(): boolean {
    return !TypeUtils.isNullOrUndefined(localStorage);
}

export class LocalStorage<T> implements IValueStorage<T> {
    private readonly serializer: IJsonSerializer<IStorageValue<T>>;

    public constructor(private readonly key: string, valueSerializer?: IJsonSerializer<T>) {
        if (!isLocalStorageSupported()) {
            throw new Error('Local storage is not supported.');
        }

        Argument.isNotNullOrEmpty(key, 'key');

        this.serializer = new LocalStorageJsonSerializer<T>(valueSerializer || new JsonSerializer<T>());
    }

    public load(): IStorageValue<T> | null {
        const json = localStorage.getItem(this.key);
        if (TypeUtils.isNullOrUndefined(json)) {
            return null;
        }

        return this.serializer.deserialize(json);
    }

    public save(value: T): void {
        const item: IStorageValue<T> = {
            createdOn: new Date(),
            value: value,
        };

        const json = this.serializer.serialize(item);

        localStorage.setItem(this.key, json);
    }

    public clear(): void {
        localStorage.removeItem(this.key);
    }
}

class LocalStorageJsonSerializer<T> extends JsonSerializer<IStorageValue<T>> {
    public constructor(valueSerializer: IJsonSerializer<T>) {
        super((k, v) => {
                if (k === 'value') {
                    return valueSerializer.serialize(v);
                }

                if (k === 'createdOn') {
                    return (v as Date).toUTCString();
                }
            },
            (k, v) => {
                if (k === 'value') {
                    return valueSerializer.deserialize(v);
                }

                if (k === 'createdOn') {
                    return new Date(v);
                }
            });
    }
}
