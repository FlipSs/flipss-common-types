import {createContinuousTimer, ITimer, TimeSpan} from "../../time";
import {IValueWrapper} from "./IValueWrapper";
import {Func} from "../../types";
import {ICachedValueProvider} from "./ICachedValueProvider";

export class AbsoluteExpirationCachedValueProvider<T> implements ICachedValueProvider<T> {
    private readonly expirationPeriodTimer: ITimer;

    public constructor(private readonly valueWrapper: IValueWrapper<T>,
                       private readonly expirationPeriodFactory: Func<TimeSpan>) {
        this.expirationPeriodTimer = createContinuousTimer(() => valueWrapper.updateValue());

        this.timer.start(this.expirationPeriod);
    }

    protected get expirationPeriod(): TimeSpan {
        return this.expirationPeriodFactory();
    }

    protected get timer(): ITimer {
        return this.expirationPeriodTimer;
    }

    public getValue(): T {
        return this.valueWrapper.getValue();
    }

    public dispose(): void {
        this.timer.dispose();
    }
}

