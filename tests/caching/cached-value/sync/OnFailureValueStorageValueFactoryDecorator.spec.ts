import {IValueFactory, OnFailureValueStorageValueFactoryDecorator} from "../../../../src/caching/internal";
import {IStorageValue, IValueStorage} from "../../../../src/storages/internal";

describe('OnFailureValueStorageValueFactoryDecorator', () => {
    it('Should call onFailure if provided', () => {
        let isCalled = false;
        const factory = new OnFailureValueStorageValueFactoryDecorator(new TestFailureValueFactory(), new TestValueStorage(), undefined, () => {
            isCalled = true;
        });

        try {
            factory.createValue();
        } catch (e) {
        }

        expect(isCalled).toBeTruthy();
    });

    it('Should throw error if storage value expired', () => {
        const factory = new OnFailureValueStorageValueFactoryDecorator(new TestFailureValueFactory(), new TestValueStorage(), new Date());

        expect(() => factory.createValue()).toThrow();
    });

    it('Should throw error if storage does not contain value', () => {
        const factory = new OnFailureValueStorageValueFactoryDecorator(new TestFailureValueFactory(), new TestValueStorage());

        expect(() => factory.createValue()).not.toThrow();
        expect(() => factory.createValue()).toThrow();
    });
});

class TestFailureValueFactory implements IValueFactory<string> {
    createValue(): string {
        throw new Error();
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
