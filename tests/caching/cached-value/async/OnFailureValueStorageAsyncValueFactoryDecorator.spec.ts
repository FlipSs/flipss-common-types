import {IValueFactory, OnFailureValueStorageAsyncValueFactoryDecorator} from "../../../../src/caching/internal";
import {IStorageValue, IValueStorage} from "../../../../src/storages/internal";

describe('OnFailureValueStorageAsyncValueFactoryDecorator', () => {
    it('Should call onFailure if provided', async () => {
        let isCalled = false;
        const factory = new OnFailureValueStorageAsyncValueFactoryDecorator(new TestFailureValueFactory(), new TestValueStorage(), undefined, () => {
            isCalled = true;
        });

        try {
            await factory.createValue();
        } catch (e) {
        }

        expect(isCalled).toBeTruthy();
    });

    it('Should throw error if storage value expired', async () => {
        const factory = new OnFailureValueStorageAsyncValueFactoryDecorator(new TestFailureValueFactory(), new TestValueStorage(), new Date());

        await expectAsync(factory.createValue()).toBeRejected();
    });

    it('Should throw error if storage does not contain value', async () => {
        const factory = new OnFailureValueStorageAsyncValueFactoryDecorator(new TestFailureValueFactory(), new TestValueStorage());

        await expectAsync(factory.createValue()).toBeResolved();
        await expectAsync(factory.createValue()).toBeRejected();
    });
});

class TestFailureValueFactory implements IValueFactory<Promise<string>> {
    createValue(): Promise<string> {
        throw new Error();
    }
}

class TestValueStorage implements IValueStorage<string> {
    private readonly _values: IStorageValue<string>[] = [{
        createdOn: new Date(new Date().getTime() / 2),
        value: 'test'
    }];

    clear(): void {
    }

    get(): IStorageValue<string> | null {
        return this._values.shift();
    }

    set(value: string): void {
    }
}
