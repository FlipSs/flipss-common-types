import {IDisposable} from "../../../models";

export interface IAsyncCachedValue<T> extends IDisposable {
    getValueAsync(): Promise<T>;
}
