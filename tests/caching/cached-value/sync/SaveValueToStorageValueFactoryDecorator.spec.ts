import {IStorageValue, IValueStorage} from "../../../../src/storages/internal";
import {DirectValueFactory, SaveValueToStorageValueFactoryDecorator} from "../../../../src/caching/internal";

describe('SaveValueToStorageValueFactoryDecorator', () => {
    it('Should save to storage', () => {
        const storage = new TestValueStorage();
        const spy = spyOn(storage, 'set');

        const factory = new SaveValueToStorageValueFactoryDecorator(new DirectValueFactory(() => 'hello'), storage);

        expect(factory.createValue()).toEqual('hello');
        expect(spy).toHaveBeenCalledWith('hello');
    });
});

class TestValueStorage implements IValueStorage<string> {
    clear(): void {
    }

    get(): IStorageValue<string> | null {
        return null;
    }

    set(value: string): void {
    }
}
