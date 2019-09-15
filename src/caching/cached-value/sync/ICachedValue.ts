import {IDisposable} from "../../../common/internal";

export interface ICachedValue<T> extends IDisposable {
    getValue(): T;

    reset(): void;
}
