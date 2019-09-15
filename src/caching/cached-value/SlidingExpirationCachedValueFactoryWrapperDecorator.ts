import {AbsoluteExpirationCachedValueFactoryWrapperDecorator} from "../internal";

export class SlidingExpirationCachedValueFactoryWrapperDecorator<T> extends AbsoluteExpirationCachedValueFactoryWrapperDecorator<T> {
    public getValue(): T {
        this.timer.resetTime();

        return super.getValue();
    }
}
