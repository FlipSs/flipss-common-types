import {createCountdownTimer, ITimer, TimeSpan} from "../../time/internal";
import {IValueFactoryWrapper} from "../internal";
import {Func} from "../../types/internal";
import {IDisposable} from "../../common/internal";

export class AbsoluteExpirationCachedValueFactoryWrapperDecorator<T> implements IValueFactoryWrapper<T>, IDisposable {
    private readonly expirationPeriodTimer: ITimer;

    public constructor(private readonly valueFactoryWrapper: IValueFactoryWrapper<T>,
                       private readonly expirationPeriodFactory: Func<TimeSpan>) {
        this.expirationPeriodTimer = createCountdownTimer(() => this.updateValue());

        this.restartTimer();
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

    public updateValue(): void {
        this.valueFactoryWrapper.updateValue();
        this.restartTimer();
    }

    private restartTimer(): void {
        this.timer.restart(this.expirationPeriodFactory());
    }
}

