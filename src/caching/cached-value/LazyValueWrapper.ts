import {ILazy, Lazy} from "../../utils";
import {IValueWrapper} from "./IValueWrapper";
import {IValueFactory} from "./IValueFactory";

export class LazyValueWrapper<T> implements IValueWrapper<T> {
    private readonly lazyValue: ILazy<T>;

    public constructor(valueFactory: IValueFactory<T>) {
        this.lazyValue = new Lazy(() => valueFactory.createValue());
    }

    public getValue(): T {
        return this.lazyValue.value;
    }

    public updateValue(): void {
        this.lazyValue.reset();
    }
}
