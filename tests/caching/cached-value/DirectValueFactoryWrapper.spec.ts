import {DirectValueFactory, DirectValueFactoryWrapper} from "../../../src/caching/internal";

describe('DirectValueFactoryWrapper', () => {
    it('Should return value from valueFactory', () => {
        const valueFactory = new DirectValueFactory(() => 17);
        const wrapper = new DirectValueFactoryWrapper(valueFactory);

        expect(wrapper.getValue()).toEqual(valueFactory.createValue());
    });

    it('Should call value factory only once or if when update value called', () => {
        const valueFactory = new DirectValueFactory(() => 17);

        const spy = spyOn(valueFactory, 'createValue').and.callThrough();
        const wrapper = new DirectValueFactoryWrapper(valueFactory);

        expect(spy).toHaveBeenCalledTimes(1);

        for (let i = 0; i < 5; i++) {
            wrapper.getValue();

            expect(spy).toHaveBeenCalledTimes(1);
        }

        spy.calls.reset();
        wrapper.updateValue();

        expect(spy).toHaveBeenCalledTimes(1);
    });
});
