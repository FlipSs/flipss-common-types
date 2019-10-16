import {IAsyncCachedValue, ICachedValue} from "../../internal";
import {Observer} from "../../../common/types";
import {IDisposable} from "../../../common/IDisposable";

export class AsyncCachedValue<T> implements IAsyncCachedValue<T> {
    public constructor(private readonly cachedValue: ICachedValue<Promise<T>>) {
    }

    public getValueAsync(): Promise<T> {
        return this.cachedValue.getValue();
    }

    public reset(): void {
        this.cachedValue.reset();
    }

    public dispose(): void {
        this.cachedValue.dispose();
    }

    public subscribe(observer: Observer): IDisposable {
        return this.cachedValue.subscribe(observer);
    }
}
