import {IJsonSerializer, JsonSerializer} from "../data/internal";
import {Argument, TypeUtils} from "../utils/internal";
import {IStorageValue, IValueStorage} from "./internal";
import {IEnumerable, IList, List} from "../collections/internal";

export function isLocalStorageSupported(): boolean {
    return !TypeUtils.isNullOrUndefined(localStorage);
}

export class LocalStorage<T> implements IValueStorage<T> {
    private static readonly storageList: IList<LocalStorage<any>> = new List<LocalStorage<any>>();

    private readonly serializer: LocalStorageJsonSerializer<T>;

    public constructor(private readonly key: string, valueSerializer?: IJsonSerializer) {
        if (!isLocalStorageSupported()) {
            throw new Error('Local storage is not supported.');
        }

        Argument.isNotNullOrEmpty(key, 'key');

        this.serializer = new LocalStorageJsonSerializer<T>(valueSerializer);

        LocalStorage.storageList.add(this);
    }

    public static clearAll(till?: Date): void {
        let toClear: IEnumerable<LocalStorage<any>>;
        if (TypeUtils.isNullOrUndefined(till)) {
            toClear = this.storageList;
        } else {
            toClear = this.storageList.where(s => {
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

class LocalStorageJsonSerializer<T> extends JsonSerializer {
    private readonly valueSerializer: IJsonSerializer;

    public constructor(valueSerializer?: IJsonSerializer) {
        super();

        this.valueSerializer = valueSerializer || new JsonSerializer();
    }

    public serialize(storedValue: IStorageValue<T>): string {
        const serializableStoredValue: ISerializableStoredValue = {
            createdOn: storedValue.createdOn.toJSON(),
            value: this.valueSerializer.serialize(storedValue.value)
        };

        return super.serialize(serializableStoredValue);
    }

    public deserialize(json: string): IStorageValue<T> {
        const serializableStoredValue = super.deserialize(json) as ISerializableStoredValue;

        return {
            createdOn: new Date(serializableStoredValue.createdOn),
            value: this.valueSerializer.deserialize(serializableStoredValue.value)
        };
    }
}

interface ISerializableStoredValue {
    createdOn: string;
    value: string;
}
