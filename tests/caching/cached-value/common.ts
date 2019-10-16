import {IValueObserver} from "../../../src/common/IValueObserver";
import {IValueFactoryWrapper} from "../../../src/caching/cached-value/IValueFactoryWrapper";
import {Func} from "../../../src/types/Func";
import {using} from "../../../src/common/functions";

export function testValueFactoryWrapper(wrapperFactory: Func<IValueFactoryWrapper<any>>) {
    it('Should call observer when value updated', () => {
        const wrapper = wrapperFactory();

        const observer = new TestObserver();
        const spy = spyOn(observer, 'onNext');

        using(wrapper.subscribe(observer), () => {
            expect(spy).not.toHaveBeenCalled();

            wrapper.updateValue();

            expect(spy).toHaveBeenCalledTimes(1);
        });

        wrapper.updateValue();
        expect(spy).toHaveBeenCalledTimes(1);
    });
}

class TestObserver implements IValueObserver {
    public onNext(): void {
    }
}
