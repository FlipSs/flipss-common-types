import {Action} from "../../types/Action";
import {IResolvablePromiseContainer} from "./IResolvablePromiseContainer";

export class ResolvablePromiseContainer<T = void> implements IResolvablePromiseContainer<T> {
    private readonly _promise!: Promise<T>;
    private _resolve!: Action<T>;
    private _reject!: Action<any>;

    public constructor() {
        this._promise = new Promise<T>((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        })
    }

    public get promise(): Promise<T> {
        return this._promise;
    }

    public reject(reason: any): void {
        this._reject(reason);
    }

    public resolve(data: T): void {
        this._resolve(data);
    }
}
