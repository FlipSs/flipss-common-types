import {IDisposable} from "../../../models/internal";

export interface IAsyncCachedValue<T> extends IDisposable {
    getValueAsync(): Promise<T>;
}
