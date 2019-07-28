export interface IValueWrapper<T> {
    getValue(): T;

    updateValue(): void;
}
