import {ILazy, Lazy} from "../../utils/internal";
import {IValueFactory, IValueFactoryWrapper} from "../internal";
import {Observable} from "../../common/Observable";

export class LazyValueFactoryWrapper<T> extends Observable implements IValueFactoryWrapper<T> {
    private readonly lazyValue: ILazy<T>;

    public constructor(valueFactory: IValueFactory<T>) {
        super();

        this.lazyValue = new Lazy(() => valueFactory.createValue());
    }

    public getValue(): T {
        return this.lazyValue.value;
    }

    public updateValue(): void {
        this.lazyValue.reset();
        this.next();
    }
}
