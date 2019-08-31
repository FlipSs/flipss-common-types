import {DirectValueFactory, LazyValueFactoryWrapper} from "../../../src/caching/internal";

describe('LazyValueFactoryWrapper', () => {
    it('Should return value from valueFactory', () => {
        const valueFactory = new DirectValueFactory(() => 17);
        const wrapper = new LazyValueFactoryWrapper(valueFactory);

        expect(wrapper.getValue()).toEqual(valueFactory.createValue());
    });

    it('Should call value factory only once when getValue called', () => {
        const valueFactory = new DirectValueFactory(() => 17);

        const spy = spyOn(valueFactory, 'createValue').and.callThrough();
        const wrapper = new LazyValueFactoryWrapper(valueFactory);

        expect(spy).not.toHaveBeenCalled();

        wrapper.getValue();
        expect(spy).toHaveBeenCalledTimes(1);

        for (let i = 0; i < 5; i++) {
            wrapper.getValue();
            expect(spy).toHaveBeenCalledTimes(1);
        }

        spy.calls.reset();
        wrapper.updateValue();

        expect(spy).not.toHaveBeenCalled();
        wrapper.getValue();
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
