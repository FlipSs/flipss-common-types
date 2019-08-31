import {AsyncCachedValue, ICachedValueProvider} from "../../../../src/caching/internal";

describe('AsyncCachedValue', () => {
    it('Should get value from value provider', async () => {
        const valueProvider = new TestValueProvider();
        const cachedValue = new AsyncCachedValue(valueProvider);

        const expectedValue = await valueProvider.getValue();
        const spy = spyOn(valueProvider, 'getValue').and.callThrough();

        await expectAsync(cachedValue.getValueAsync()).toBeResolvedTo(expectedValue);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Should dispose value provider', () => {
        const valueProvider = new TestValueProvider();
        const cachedValue = new AsyncCachedValue(valueProvider);
        const spy = spyOn(valueProvider, 'dispose');

        cachedValue.dispose();
        expect(spy).toHaveBeenCalledTimes(1);
    });
});

class TestValueProvider implements ICachedValueProvider<Promise<any>> {
    public dispose(): void {
    }

    public getValue(): Promise<any> {
        return Promise.resolve(17);
    }
}
