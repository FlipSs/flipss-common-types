import {AbsoluteExpirationCache, IStoredValue} from "../internal";

export class SlidingExpirationCache<TKey, TValue> extends AbsoluteExpirationCache<TKey, TValue> {
    protected getValue(storedValue: IStoredValue<TValue>): TValue {
        storedValue.updatedOn = new Date();

        return super.getValue(storedValue);
    }
}

