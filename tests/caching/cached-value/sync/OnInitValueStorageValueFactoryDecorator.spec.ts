import {IValueFactory, OnInitValueStorageValueFactoryDecorator} from "../../../../src/caching/internal";
import {IStorageValue, IValueStorage} from "../../../../src/storages/internal";

describe('OnInitValueStorageValueFactoryDecorator', () => {
    it('Should take value from storage for first time if it exists and not expired', () => {
        const factory = new OnInitValueStorageValueFactoryDecorator(new TestValueFactory(), new TestValueStorage());

        expect(factory.createValue()).toEqual(new TestValueStorage().get().value);
        expect(factory.createValue()).toEqual(new TestValueFactory().createValue());
    });

    it('Should not take value from storage it not exists', () => {
        const valueStorage = new TestValueStorage();
        valueStorage.get();

        const factory = new OnInitValueStorageValueFactoryDecorator(new TestValueFactory(), valueStorage);

        expect(factory.createValue()).toEqual(new TestValueFactory().createValue());
    });

    it('Should not take value from storage if it expired', () => {
        const factory = new OnInitValueStorageValueFactoryDecorator(new TestValueFactory(), new TestValueStorage(), new Date());

        expect(factory.createValue()).toEqual(new TestValueFactory().createValue());
    });
});

class TestValueFactory implements IValueFactory<string> {
    createValue(): string {
        return 'test1';
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
