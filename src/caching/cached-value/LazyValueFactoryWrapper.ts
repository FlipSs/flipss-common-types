import {ILazy, Lazy} from "../../utils/internal";
import {IValueFactory, IValueFactoryWrapper} from "../internal";
import {Observable} from "../../common/Observable";

export class LazyValueFactoryWrapper<T> extends Observable implements IValueFactoryWrapper<T> {
    private readonly _lazyValue: ILazy<T>;

    public constructor(valueFactory: IValueFactory<T>) {
        super();

        this._lazyValue = new Lazy(() => valueFactory.createValue());
    }

    public getValue(): T {
        return this._lazyValue.value;
    }

    public updateValue(silent?: boolean): void {
        this._lazyValue.reset();

        if (!silent) {
            this.next();
        }
    }
}
