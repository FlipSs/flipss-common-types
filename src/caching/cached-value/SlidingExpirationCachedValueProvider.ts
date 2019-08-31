import {AbsoluteExpirationCachedValueProvider} from "../internal";

export class SlidingExpirationCachedValueProvider<T> extends AbsoluteExpirationCachedValueProvider<T> {
    public getValue(): T {
        this.timer.resetTime();

        return super.getValue();
    }
}
