import {createCountdownTimer, ITimer, TimeSpan} from "../../time/internal";
import {ICachedValueProvider, IValueWrapper} from "../internal";
import {Func} from "../../types/internal";

export class AbsoluteExpirationCachedValueProvider<T> implements ICachedValueProvider<T> {
    private readonly expirationPeriodTimer: ITimer;

    public constructor(private readonly valueWrapper: IValueWrapper<T>,
                       private readonly expirationPeriodFactory: Func<TimeSpan>) {
        this.expirationPeriodTimer = createCountdownTimer(() => {
            valueWrapper.updateValue();
            this.startTimer();
        });
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

    private startTimer(): void {
        this.timer.start(this.expirationPeriod);
    }
}

