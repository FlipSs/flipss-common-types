import {createCountdownTimer, ITimer, TimeSpan} from "../../time";
import {IValueWrapper} from "./IValueWrapper";
import {Func} from "../../types";
import {ICachedValue} from "./ICachedValue";

export class AbsoluteExpirationCachedValue<T> implements ICachedValue<T> {
    private readonly expirationPeriodTimer: ITimer;

    public constructor(private readonly valueWrapper: IValueWrapper<T>,
                       private readonly expirationPeriodFactory: Func<TimeSpan>) {
        this.expirationPeriodTimer = createCountdownTimer(() => {
            valueWrapper.updateValue();
            this.startTimer();
        });

        this.startTimer();
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

    private startTimer() {
        this.timer.start(this.expirationPeriod);
    }
}
