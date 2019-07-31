import {AbsoluteExpirationCachedValueProvider} from "../internal";

export class SlidingExpirationCachedValueProvider<T> extends AbsoluteExpirationCachedValueProvider<T> {
    public getValue(): T {
        this.timer.restart(this.expirationPeriod);

        return super.getValue();
    }
}
