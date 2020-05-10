import {createCountdownTimer, ITimer, TimeSpan} from "../../time/internal";
import {IValueFactoryWrapper} from "../internal";
import {Func} from "../../types/internal";
import {IDisposable, Observer} from "../../common/internal";

export class AbsoluteExpirationCachedValueFactoryWrapperDecorator<T> implements IValueFactoryWrapper<T>, IDisposable {
    private readonly _expirationPeriodTimer!: ITimer;

    public constructor(private readonly _valueFactoryWrapper: IValueFactoryWrapper<T>,
                       private readonly _expirationPeriodFactory: Func<TimeSpan>) {
        this._expirationPeriodTimer = createCountdownTimer(() => this.updateValue());

        this.restartTimer();
    }

    protected get timer(): ITimer {
        return this._expirationPeriodTimer;
    }

    public getValue(): T {
        return this._valueFactoryWrapper.getValue();
    }

    public dispose(): void {
        this._expirationPeriodTimer.dispose();
    }

    public updateValue(silent?: boolean): void {
        this._valueFactoryWrapper.updateValue(silent);
        this.restartTimer();
    }

    public subscribe(observer: Observer): IDisposable {
        return this._valueFactoryWrapper.subscribe(observer);
    }

    private restartTimer(): void {
        this._expirationPeriodTimer.restart(this._expirationPeriodFactory());
    }
}

