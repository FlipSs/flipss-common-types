import {IAsyncCachedValue} from "./IAsyncCachedValue";
import {ICachedValueProvider} from "../ICachedValueProvider";

export class AsyncCachedValue<T> implements IAsyncCachedValue<T> {
    public constructor(private readonly valueProvider: ICachedValueProvider<Promise<T>>) {
    }

    public getValueAsync(): Promise<T> {
        return this.valueProvider.getValue();
    }

    public dispose(): void {
        this.valueProvider.dispose();
    }
}
