import {LocalStorage} from "../../src/storages/internal";
import {TypedJsonSerializer} from "../../src/data/json/TypedJsonSerializer";
import {buildObjectConverterUsingConstructor} from "../../src/converters/ObjectConverterBuilder";

describe('LocalStorage', () => {
    describe('clearAll', () => {
        it('Should clear all if till is not specified', () => {
            const keys = ['test1', 'test2', 'test3'];
            const storageList = keys.map(k => createStorage(k));

            for (const storage of storageList) {
                storage.set(new StoredValue());
            }

            for (const key of keys) {
                expect(localStorage.getItem(key) != undefined).toBeTruthy();
            }

            LocalStorage.clearAll();

            for (const key of keys) {
                expect(localStorage.getItem(key)).toBeNull();
            }
        });

        it('Should clear all values that older than provided date', async () => {
            const oldStorage = createStorage('old');
            oldStorage.set(new StoredValue());

            const till = new Date();

            await new Promise((resolve) => setTimeout(resolve, 1000));

            const newStorage = createStorage('new');
            newStorage.set(new StoredValue());

            LocalStorage.clearAll(till);

            expect(localStorage.getItem('old')).toBeNull();
            expect(localStorage.getItem('new') != undefined).toBeTruthy();
        });
    });

    describe('get', () => {
        let storage: LocalStorage<StoredValue>;

        beforeEach(() => storage = createStorage('get'));
        afterEach(() => storage.clear());

        it('Should null if value not set', () => {
            expect(storage.get()).toBeNull();
        });

        it('Should return value if it set', () => {
            const value = new Date();
            const storedValue = new StoredValue();
            storedValue.date = value;
            storage.set(storedValue);

            expect(storage.get().value.date).toEqual(value);
        });
    });

    describe('set', () => {
        let storage: LocalStorage<StoredValue>;

        beforeEach(() => storage = createStorage('set'));
        afterEach(() => storage.clear());

        it('Should set value to local storage', () => {
            storage.set(new StoredValue());

            expect(localStorage.getItem('set') != undefined).toBeTruthy();
        });
    });

    describe('clear', () => {
        let storage: LocalStorage<StoredValue>;

        beforeEach(() => storage = createStorage('clear'));
        afterEach(() => storage.clear());

        it('Should clear storage', () => {
            storage.set(new StoredValue());

            expect(localStorage.getItem('clear') != undefined).toBeTruthy();

            storage.clear();

            expect(localStorage.getItem('clear')).toBeNull();
        });
    });
});


function createStorage(key: string): LocalStorage<StoredValue> {
    return new LocalStorage(key,
        new TypedJsonSerializer<StoredValue>(
            buildObjectConverterUsingConstructor<any, StoredValue>(StoredValue).useDirectPropertyTransferring().create(),
            undefined,
            (k, v) => {
                if (k === 'date') {
                    return new Date(v);
                }

                return v;
            },
        ));
}

class StoredValue {
    public date: Date;

    public constructor() {
        this.date = new Date();
    }
}
