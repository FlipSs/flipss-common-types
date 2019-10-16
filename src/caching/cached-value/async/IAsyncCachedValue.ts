import {IDisposable, IObservable} from "../../../common/internal";

export interface IAsyncCachedValue<T> extends IDisposable, IObservable {
    getValueAsync(): Promise<T>;

    reset(): void;
}
