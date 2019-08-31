import {createCountdownTimer, ITimer, TimeSpan} from "../../time/internal";
import {ICachedValueProvider, IValueFactoryWrapper} from "../internal";
import {Func} from "../../types/internal";

export class AbsoluteExpirationCachedValueProvider<T> implements ICachedValueProvider<T> {
    private readonly expirationPeriodTimer: ITimer;

    public constructor(private readonly valueFactoryWrapper: IValueFactoryWrapper<T>,
                       private readonly expirationPeriodFactory: Func<TimeSpan>) {
        this.expirationPeriodTimer = createCountdownTimer(() => {
            this.valueFactoryWrapper.updateValue();
            this.startTimer();
        });

        this.startTimer();
    }

    protected get timer(): ITimer {
        return this.expirationPeriodTimer;
    }

    public getValue(): T {
        return this.valueFactoryWrapper.getValue();
    }

    public dispose(): void {
        this.timer.dispose();
    }

    private startTimer(): void {
        this.timer.start(this.expirationPeriodFactory());
    }
}

