import {ICachedValue, IValueFactoryWrapper} from "../../internal";
import {IDisposable, Observer, tryDispose} from "../../../common/internal";

export class CachedValue<T> implements ICachedValue<T> {
    public constructor(private readonly valueFactoryWrapper: IValueFactoryWrapper<T>) {
    }

    public getValue(): T {
        return this.valueFactoryWrapper.getValue();
    }

    public reset(): void {
        this.valueFactoryWrapper.updateValue();
    }

    public dispose(): void {
        tryDispose(this.valueFactoryWrapper);
    }

    public subscribe(observer: Observer): IDisposable {
        return this.valueFactoryWrapper.subscribe(observer);
    }
}
