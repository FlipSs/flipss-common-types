export interface ILazy<T> {
    readonly value: T;

    reset(): void;
}
