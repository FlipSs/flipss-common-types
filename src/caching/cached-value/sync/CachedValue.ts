import {ICachedValue, IValueFactoryWrapper} from "../../internal";
import {IDisposable, Observer, tryDispose} from "../../../common/internal";

export class CachedValue<T> implements ICachedValue<T> {
    public constructor(private readonly _valueFactoryWrapper: IValueFactoryWrapper<T>) {
    }

    public getValue(): T {
        return this._valueFactoryWrapper.getValue();
    }

    public reset(): void {
        this._valueFactoryWrapper.updateValue();
    }

    public dispose(): void {
        tryDispose(this._valueFactoryWrapper);
    }

    public subscribe(observer: Observer): IDisposable {
        return this._valueFactoryWrapper.subscribe(observer);
    }
}
