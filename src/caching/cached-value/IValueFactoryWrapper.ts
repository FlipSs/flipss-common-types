import {IObservable} from "../../common/internal";

export interface IValueFactoryWrapper<T> extends IObservable {
    getValue(): T;

    updateValue(): void;
}
