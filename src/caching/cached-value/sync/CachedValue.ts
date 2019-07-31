import {ICachedValue, ICachedValueProvider} from "../../internal";

export class CachedValue<T> implements ICachedValue<T> {
    public constructor(private readonly valueProvider: ICachedValueProvider<T>) {
    }

    public getValue(): T {
        return this.valueProvider.getValue();
    }

    public dispose(): void {
        this.valueProvider.dispose();
    }
}
