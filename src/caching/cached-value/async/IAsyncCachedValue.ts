import {IDisposable} from "../../../common/internal";

export interface IAsyncCachedValue<T> extends IDisposable {
    getValueAsync(): Promise<T>;
}
