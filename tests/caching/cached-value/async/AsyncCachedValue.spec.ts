import {AsyncCachedValue, CachedValue, IValueFactoryWrapper} from "../../../../src/caching/internal";
import {IDisposable, Observer} from "../../../../src/common/internal";

describe('AsyncCachedValue', () => {
    it('Should get value from value factory wrapper', async () => {
        const valueFactoryWrapper = new TestValueFactoryWrapper();
        const cachedValue = new AsyncCachedValue(new CachedValue(valueFactoryWrapper));

        const expectedValue = await valueFactoryWrapper.getValue();
        const spy = spyOn(valueFactoryWrapper, 'getValue').and.callThrough();

        await expectAsync(cachedValue.getValueAsync()).toBeResolvedTo(expectedValue);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Should dispose value factory wrapper if it disposable', () => {
        const valueFactoryWrapper = new TestValueFactoryWrapper();
        const cachedValue = new AsyncCachedValue(new CachedValue(valueFactoryWrapper));
        const spy = spyOn(valueFactoryWrapper, 'dispose');

        cachedValue.dispose();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Should not throw if value factory wrapper not disposable', () => {
        const cachedValue = new AsyncCachedValue(new CachedValue(new NonDisposableTestValueFactoryWrapper()));

        expect(() => cachedValue.dispose()).not.toThrow();
    });

    it('Should call updateValue method of value factory wrapper when reset called', () => {
        const valueFactoryWrapper = new TestValueFactoryWrapper();
        const cachedValue = new AsyncCachedValue(new CachedValue(valueFactoryWrapper));
        const spy = spyOn(valueFactoryWrapper, 'updateValue');

        cachedValue.reset();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Should call subscribe method of value factory wrapper when subscribe called', () => {
        const valueFactoryWrapper = new TestValueFactoryWrapper();
        const cachedValue = new AsyncCachedValue(new CachedValue(valueFactoryWrapper));
        const spy = spyOn(valueFactoryWrapper, 'subscribe');

        cachedValue.subscribe(null);
        expect(spy).toHaveBeenCalledTimes(1);
    });
});

class NonDisposableTestValueFactoryWrapper implements IValueFactoryWrapper<Promise<any>> {
    public getValue(): Promise<any> {
        return Promise.resolve(17);
    }

    public updateValue(): void {
    }

    public subscribe(observer: Observer): IDisposable {
        return null;
    }
}

class TestValueFactoryWrapper extends NonDisposableTestValueFactoryWrapper implements IDisposable {
    public dispose(): void {
    }
}
