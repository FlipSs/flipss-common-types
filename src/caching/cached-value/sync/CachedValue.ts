import {ICachedValueProvider} from "../ICachedValueProvider";
import {ICachedValue} from "./ICachedValue";

export class CachedValue<T> implements ICachedValue<T> {
    public constructor(private readonly valueProvider: ICachedValueProvider<T>) {
    }

    public getValue(): T {
        return this.valueProvider.getValue();
    }
}
