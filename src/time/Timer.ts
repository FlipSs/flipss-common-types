import {IList, List} from "../collections/internal";
import {Argument, TypeUtils} from "../utils/internal";
import {ITimer, TimerState, TimeSpan} from "./internal";
import {Action} from "../types/internal";

const timeout = 50;

class TimerManager {
    private readonly _timers!: IList<Timer>;
    private _intervalId: number | null;

    public constructor() {
        this._timers = new List<Timer>();
        this._intervalId = null;
    }

    private get isIntervalSet(): boolean {
        return !TypeUtils.isNullOrUndefined(this._intervalId);
    }

    public add(timer: Timer): void {
        this._timers.add(timer);

        if (!this.isIntervalSet) {
            this.setInterval();
        }
    }

    public remove(timer: Timer): void {
        this._timers.tryRemove(timer);

        if (this._timers.isEmpty) {
            this.clearInterval();
        }
    }

    private setInterval(): void {
        this._intervalId = window.setInterval(() => {
            for (const timer of this._timers) {
                timer.update(TimeSpan.fromMilliseconds(timeout));
            }
        }, timeout);
    }

    private clearInterval(): void {
        if (this.isIntervalSet) {
            clearInterval(this._intervalId);

            this._intervalId = null;
        }
    }
}

const manager = new TimerManager();

abstract class Timer implements ITimer {
    private _state!: TimerState;
    private _timeLeft: TimeSpan | undefined;
    private _period: TimeSpan | undefined;

    protected constructor() {
        this._state = TimerState.stopped;
    }

    public update(period: TimeSpan): void {
        const timeLeft = this._timeLeft.subtract(period);

        this._timeLeft = timeLeft;

        this.onUpdate(timeLeft);
    }

    public start(period: TimeSpan): void {
        Argument.isNotNullOrUndefined(period, 'period');

        if (this._state !== TimerState.stopped) {
            throw new Error('Timer is in progress.');
        }

        this.startInternal(period);
    }

    public stop(): void {
        if (this._state === TimerState.stopped) {
            throw new Error('Timer already stopped.');
        }

        this.stopInternal();
    }

    public getState(): TimerState {
        return this._state;
    }

    public restart(period: TimeSpan): void {
        Argument.isNotNullOrUndefined(period, 'period');

        this.tryStop();
        this.startInternal(period);
    }

    public resume(): void {
        if (this._state !== TimerState.suspended) {
            throw new Error('Timer is not suspended.');
        }

        manager.add(this);
        this._state = TimerState.started;
    }

    public suspend(): void {
        if (this._state !== TimerState.started) {
            throw new Error('Timer is not started.');
        }

        manager.remove(this);
        this._state = TimerState.suspended;
    }

    public dispose(): void {
        this.tryStop();
    }

    public resetTime(): void {
        if (this._state === TimerState.stopped) {
            throw new Error('Timer is stopped.');
        }

        this.resetTimeInternal();
    }

    protected tryStop(): void {
        if (this._state !== TimerState.stopped) {
            this.stopInternal();
        }
    }

    protected tryResetTime(): void {
        if (this._state !== TimerState.stopped) {
            this.resetTimeInternal();
        }
    }

    protected abstract onUpdate(timeLeft: TimeSpan): void;

    private resetTimeInternal(): void {
        this._timeLeft = this._period;
    }

    private stopInternal(): void {
        if (this._state === TimerState.started) {
            manager.remove(this);
        }

        this._timeLeft = undefined;
        this._period = undefined;
        this._state = TimerState.stopped;
    }

    private startInternal(period: TimeSpan): void {
        this._period = period;
        this._timeLeft = period;

        manager.add(this);

        this._state = TimerState.started;
    }
}

class CountdownTimer extends Timer {
    public constructor(private readonly onEnd: Action,
                       private readonly onTick?: Action<TimeSpan>) {
        super();
    }

    protected onUpdate(timeLeft: TimeSpan): void {
        if (!TypeUtils.isNullOrUndefined(this.onTick)) {
            this.onTick(timeLeft);
        }

        if (timeLeft.milliseconds <= 0) {
            this.tryStop();
            this.onEnd();
        }
    }
}

class ContinuousTimer extends Timer {
    public constructor(private readonly onPeriod: Action) {
        super();
    }

    protected onUpdate(timeLeft: TimeSpan): void {
        if (timeLeft.milliseconds <= 0) {
            this.onPeriod();
            this.tryResetTime();
        }
    }
}

export function createCountdownTimer(onEnd: Action, onTick?: Action<TimeSpan>): ITimer {
    Argument.isNotNullOrUndefined(onEnd, 'onEnd');

    return new CountdownTimer(onEnd, onTick);
}

export function createContinuousTimer(onPeriod: Action): ITimer {
    Argument.isNotNullOrUndefined(onPeriod, 'onPeriod');

    return new ContinuousTimer(onPeriod);
}
