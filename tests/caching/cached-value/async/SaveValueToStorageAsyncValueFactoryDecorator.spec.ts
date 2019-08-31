import {IStorageValue, IValueStorage} from "../../../../src/storages/internal";
import {DirectValueFactory, SaveValueToStorageAsyncValueFactoryDecorator} from "../../../../src/caching/internal";

describe('SaveValueToStorageAsyncValueFactoryDecorator', () => {
    it('Should save to storage', async () => {
        const storage = new TestValueStorage();
        const spy = spyOn(storage, 'set');

        const factory = new SaveValueToStorageAsyncValueFactoryDecorator(new DirectValueFactory(() => Promise.resolve('test')), storage);

        await expectAsync(factory.createValue()).toBeResolvedTo('test');
        expect(spy).toHaveBeenCalledWith('test');
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
