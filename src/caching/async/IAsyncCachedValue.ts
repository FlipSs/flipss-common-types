import {Func} from "../../types";
import {ILazy, Lazy} from "../../utils";

export interface IAsyncCachedValue<T> {
    getValueAsync(): Promise<T>;
}

export interface IAsyncValueWrapper<T> {
    getValueAsync(): Promise<T>;

    updateValueAsync(): Promise<void>;
}

export class InstantAsyncValueWrapper<T> implements IAsyncValueWrapper<T> {
    private value: Promise<T>;

    public constructor(private readonly valueFactory: Func<Promise<T>>) {
    }

    public getValueAsync(): Promise<T> {
        return this.value;
    }

    public updateValueAsync(): Promise<void> {
        this.value = this.valueFactory();

        return Promise.resolve();
    }
}

export class LazyAsyncValueWrapper<T> implements IAsyncValueWrapper<T> {
    private readonly value: ILazy<Promise<T>>;

    public constructor(private readonly valueFactory: Func<Promise<T>>) {
        this.value = new Lazy(valueFactory);
    }

    public getValueAsync(): Promise<T> {
        return this.value.value;
    }

    public updateValueAsync(): Promise<void> {
        this.value.reset();

        return Promise.resolve();
    }
}
