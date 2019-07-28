import {AbsoluteExpirationCachedValue} from "./AbsoluteExpirationCachedValue";

export class SlidingExpirationCachedValue<T> extends AbsoluteExpirationCachedValue<T> {
    public getValue(): T {
        this.timer.restart(this.expirationPeriod);

        return super.getValue();
    }
}
