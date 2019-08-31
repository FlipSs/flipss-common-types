import {IValueFactory, OnInitValueStorageAsyncValueFactoryDecorator} from "../../../../src/caching/internal";
import {IStorageValue, IValueStorage} from "../../../../src/storages/internal";

describe('OnInitValueStorageAsyncValueFactoryDecorator', () => {
    it('Should take value from storage for first time if it exists and not expired', async () => {
        const factory = new OnInitValueStorageAsyncValueFactoryDecorator(new TestValueFactory(), new TestValueStorage());

        await expectAsync(factory.createValue()).toBeResolvedTo(new TestValueStorage().get().value);

        const expectedValue = await new TestValueFactory().createValue();
        await expectAsync(factory.createValue()).toBeResolvedTo(expectedValue);
    });

    it('Should not take value from storage it not exists', async () => {
        const valueStorage = new TestValueStorage();
        valueStorage.get();

        const factory = new OnInitValueStorageAsyncValueFactoryDecorator(new TestValueFactory(), valueStorage);

        const expectedValue = await new TestValueFactory().createValue();
        await expectAsync(factory.createValue()).toBeResolvedTo(expectedValue);
    });

    it('Should not take value from storage if it expired', async () => {
        const factory = new OnInitValueStorageAsyncValueFactoryDecorator(new TestValueFactory(), new TestValueStorage(), new Date());

        const expectedValue = await new TestValueFactory().createValue();
        await expectAsync(factory.createValue()).toBeResolvedTo(expectedValue);
    });
});

class TestValueFactory implements IValueFactory<Promise<string>> {
    createValue(): Promise<string> {
        return Promise.resolve('test1');
    }
}

class TestValueStorage implements IValueStorage<string> {
    private readonly values: IStorageValue<string>[] = [{
        createdOn: new Date(new Date().getTime() / 2),
        value: 'test'
    }];

    clear(): void {
    }

    get(): IStorageValue<string> | null {
        return this.values.shift();
    }

    set(value: string): void {
    }
}
