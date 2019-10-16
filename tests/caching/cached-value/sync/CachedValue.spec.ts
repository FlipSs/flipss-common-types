import {CachedValue, IValueFactoryWrapper} from "../../../../src/caching/internal";
import {IDisposable, Observer} from "../../../../src/common/internal";

describe('CachedValue', () => {
    it('Should get value from value factory wrapper', () => {
        const valueFactoryWrapper = new TestValueFactoryWrapper();
        const cachedValue = new CachedValue(valueFactoryWrapper);

        const expectedValue = valueFactoryWrapper.getValue();
        const spy = spyOn(valueFactoryWrapper, 'getValue').and.callThrough();

        expect(cachedValue.getValue()).toEqual(expectedValue);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Should dispose value factory wrapper if it disposable', () => {
        const valueFactoryWrapper = new TestValueFactoryWrapper();
        const cachedValue = new CachedValue(valueFactoryWrapper);
        const spy = spyOn(valueFactoryWrapper, 'dispose');

        cachedValue.dispose();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Should not throw if value factory wrapper not disposable', () => {
        const cachedValue = new CachedValue(new NonDisposableTestValueFactoryWrapper());

        expect(() => cachedValue.dispose()).not.toThrow();
    });

    it('Should call updateValue method of value factory wrapper when reset called', () => {
        const valueFactoryWrapper = new TestValueFactoryWrapper();
        const cachedValue = new CachedValue(valueFactoryWrapper);
        const spy = spyOn(valueFactoryWrapper, 'updateValue');

        cachedValue.reset();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Should call subscribe method of value factory wrapper when subscribe called', () => {
        const valueFactoryWrapper = new TestValueFactoryWrapper();
        const cachedValue = new CachedValue(valueFactoryWrapper);
        const spy = spyOn(valueFactoryWrapper, 'subscribe');

        cachedValue.subscribe(null);
        expect(spy).toHaveBeenCalledTimes(1);
    });
});

class NonDisposableTestValueFactoryWrapper implements IValueFactoryWrapper<any> {
    public getValue(): any {
        return {
            value: 123
        };
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
