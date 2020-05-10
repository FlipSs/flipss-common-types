import {IAsyncCachedValue, ICachedValue} from "../../internal";
import {Observer} from "../../../common/types";
import {IDisposable} from "../../../common/IDisposable";

export class AsyncCachedValue<T> implements IAsyncCachedValue<T> {
    public constructor(private readonly _cachedValue: ICachedValue<Promise<T>>) {
    }

    public async getValueAsync(): Promise<T> {
        try {
            return await this._cachedValue.getValue();
        } catch (e) {
            this.reset(true);

            throw e;
        }
    }

    public reset(silent?: boolean): void {
        this._cachedValue.reset(silent);
    }

    public dispose(): void {
        this._cachedValue.dispose();
    }

    public subscribe(observer: Observer): IDisposable {
        return this._cachedValue.subscribe(observer);
    }
}
