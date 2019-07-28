export interface IAsyncCachedValue<T> {
    getValueAsync(): Promise<T>;
}
