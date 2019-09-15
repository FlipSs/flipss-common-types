import {IAsyncCachedValue, IValueFactoryWrapper} from "../../internal";
import {tryDispose} from "../../../common/internal";

export class AsyncCachedValue<T> implements IAsyncCachedValue<T> {
    public constructor(private readonly valueFactoryWrapper: IValueFactoryWrapper<Promise<T>>) {
    }

    public getValueAsync(): Promise<T> {
        return this.valueFactoryWrapper.getValue();
    }

    public reset(): void {
        this.valueFactoryWrapper.updateValue();
    }

    public dispose(): void {
        tryDispose(this.valueFactoryWrapper);
    }
}
