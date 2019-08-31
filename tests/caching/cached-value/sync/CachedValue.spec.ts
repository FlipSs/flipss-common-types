import {CachedValue, ICachedValueProvider} from "../../../../src/caching/internal";

describe('CachedValue', () => {
    it('Should get value from value provider', () => {
        const valueProvider = new TestValueProvider();
        const cachedValue = new CachedValue(valueProvider);

        const expectedValue = valueProvider.getValue();
        const spy = spyOn(valueProvider, 'getValue').and.callThrough();

        expect(cachedValue.getValue()).toEqual(expectedValue);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Should dispose value provider', () => {
        const valueProvider = new TestValueProvider();
        const cachedValue = new CachedValue(valueProvider);
        const spy = spyOn(valueProvider, 'dispose');

        cachedValue.dispose();
        expect(spy).toHaveBeenCalledTimes(1);
    });
});

class TestValueProvider implements ICachedValueProvider<any> {
    public dispose(): void {
    }

    public getValue(): any {
        return {
            value: 123
        };
    }
}
