export interface IResolvablePromiseContainer<T = void> {
    readonly promise: Promise<T>;

    resolve(data: T): void;

    reject(reason: any): void;
}
