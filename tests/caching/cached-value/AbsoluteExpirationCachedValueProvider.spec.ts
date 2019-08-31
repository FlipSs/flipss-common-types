import {
    AbsoluteExpirationCachedValueProvider,
    DirectValueFactory,
    DirectValueFactoryWrapper
} from "../../../src/caching/internal";
import {TimeSpan} from "../../../src/time/internal";
import {using, usingAsync} from "../../../src/common/internal";

describe('AbsoluteExpirationCachedValueProvider', () => {
    it('Should return value from valueFactoryWrapper', () => {
        const valueFactoryWrapper = new DirectValueFactoryWrapper(new DirectValueFactory(() => 15));
        using(new AbsoluteExpirationCachedValueProvider(valueFactoryWrapper, () => TimeSpan.fromMilliseconds(100)), valueProvider => {
            expect(valueProvider.getValue()).toEqual(valueFactoryWrapper.getValue());
        });
    });

    it('Should call updateValue in valueFactoryWrapper when time is up', async () => {
        const valueFactoryWrapper = new DirectValueFactoryWrapper(new DirectValueFactory(() => 15));
        const spy = spyOn(valueFactoryWrapper, 'updateValue');

        await usingAsync(new AbsoluteExpirationCachedValueProvider(valueFactoryWrapper, () => TimeSpan.fromMilliseconds(100)), async () => {
            for (let i = 0; i < 5; i++) {
                await new Promise(resolve => setTimeout(resolve, 110));

                expect(spy).toHaveBeenCalledTimes(i + 1);
            }
        });
    });
});
