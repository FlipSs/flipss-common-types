export interface IValueObserver<T> {
    onNext(value: Readonly<T>): void;
}
