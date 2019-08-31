import {
    DirectValueFactory,
    DirectValueFactoryWrapper,
    SlidingExpirationCachedValueProvider
} from "../../../src/caching/internal";
import {TimeSpan} from "../../../src/time/internal";
import {using, usingAsync} from "../../../src/common/internal";

describe('SlidingExpirationCachedValueProvider', () => {
    it('Should return value from valueFactoryWrapper', () => {
        const valueFactoryWrapper = new DirectValueFactoryWrapper(new DirectValueFactory(() => 17));
        using(new SlidingExpirationCachedValueProvider(valueFactoryWrapper, () => TimeSpan.fromMilliseconds(100)), valueProvider => {
            expect(valueProvider.getValue()).toEqual(valueFactoryWrapper.getValue());
        });
    });

    it('Should call updateValue in valueFactoryWrapper when time is up and value has not been accessed', async () => {
        const valueFactoryWrapper = new DirectValueFactoryWrapper(new DirectValueFactory(() => 15));
        const spy = spyOn(valueFactoryWrapper, 'updateValue');

        await usingAsync(new SlidingExpirationCachedValueProvider(valueFactoryWrapper, () => TimeSpan.fromMilliseconds(200)), async valueProvider => {
            await new Promise(resolve => setTimeout(resolve, 210));
            expect(spy).toHaveBeenCalledTimes(1);

            spy.calls.reset();

            for (let i = 0; i < 5; i++) {
                await new Promise(resolve => setTimeout(resolve, 50));

                expect(spy).not.toHaveBeenCalled();
                valueProvider.getValue();
            }

            await new Promise(resolve => setTimeout(resolve, 210));
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });
});
