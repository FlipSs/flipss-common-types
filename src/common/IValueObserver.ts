export interface IValueObserver<T = void> {
    onNext(value?: Readonly<T>): void;
}
