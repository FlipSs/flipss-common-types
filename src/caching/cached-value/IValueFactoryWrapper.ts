export interface IValueFactoryWrapper<T> {
    getValue(): T;

    updateValue(): void;
}
