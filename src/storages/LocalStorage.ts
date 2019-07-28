import {IJsonSerializer} from "../json/IJsonSerializer";
import {Argument, TypeUtils} from "../utils";
import {JsonSerializer} from "../json/JsonSerializer";
import {IValueStorage} from "./IValueStorage";
import {IStorageValue} from "./IStorageValue";
import {Collection, ICollection, IEnumerable} from "../collections";

export function isLocalStorageSupported(): boolean {
    return !TypeUtils.isNullOrUndefined(localStorage);
}

export class LocalStorage<T> implements IValueStorage<T> {
    private static readonly storageCollection: ICollection<LocalStorage<any>> = new Collection<LocalStorage<any>>();

    private readonly serializer: IJsonSerializer<IStorageValue<T>>;

    public constructor(private readonly key: string, valueSerializer?: IJsonSerializer<T>) {
        if (!isLocalStorageSupported()) {
            throw new Error('Local storage is not supported.');
        }

        Argument.isNotNullOrEmpty(key, 'key');

        this.serializer = new LocalStorageJsonSerializer<T>(valueSerializer || new JsonSerializer<T>());

        LocalStorage.storageCollection.add(this);
    }

    public static clearAll(till?: Date): void {
        let toClear: IEnumerable<LocalStorage<any>>;
        if (TypeUtils.isNullOrUndefined(till)) {
            toClear = this.storageCollection;
        } else {
            toClear = this.storageCollection.where(s => {
                const value = s.get();

                return value && value.createdOn <= till;
            });
        }

        toClear.forEach(s => s.clear());
    }

    public get(): IStorageValue<T> | null {
        const json = localStorage.getItem(this.key);
        if (TypeUtils.isNullOrUndefined(json)) {
            return null;
        }

        return this.serializer.deserialize(json);
    }

    public set(value: T): void {
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
