import {Action} from "../types";
import {TimeSpan} from "./TimeSpan";
import {ITimer} from "./ITimer";
import {Argument, TypeUtils} from "../utils";
import {Collection, ICollection} from "../collections";
import {TimerState} from "./TimerState";

const intervalPeriod = 250;

class TimerManager {
    private readonly timers: ICollection<Timer>;
    private intervalId: number;

    public constructor() {
        this.timers = new Collection<Timer>();
    }

    private get isIntervalSet(): boolean {
        return !TypeUtils.isNullOrUndefined(this.intervalId);
    }

    public add(timer: Timer): void {
        this.timers.add(timer);

        if (!this.isIntervalSet) {
            this.setInterval();
        }
    }

    public remove(timer: Timer): void {
        this.timers.tryRemove(timer);

        if (this.timers.isEmpty) {
            this.clearInterval();
        }
    }

    private setInterval(): void {
        this.intervalId = setInterval(() => {
            for (const timer of this.timers) {
                timer.update(TimeSpan.fromMilliseconds(intervalPeriod));
            }
        }, intervalPeriod);
    }

    private clearInterval(): void {
        if (this.isIntervalSet) {
            clearInterval(this.intervalId);

            this.intervalId = null;
        }
    }
}

const manager = new TimerManager();

abstract class Timer implements ITimer {
    private state: TimerState;
    private timeLeft: TimeSpan | undefined;
    private period: TimeSpan | undefined;

    protected constructor() {
        this.state = TimerState.stopped;
    }

    public update(period: TimeSpan): void {
        const timeLeft = this.timeLeft.subtract(period);

        this.timeLeft = timeLeft;

        this.onUpdate(timeLeft);
    }

    public start(period: TimeSpan): void {
        Argument.isNotNullOrUndefined(period, 'period');

        if (this.state !== TimerState.stopped) {
            throw new Error('Timer is in progress.');
        }

        this.startInternal(period);
    }

    public stop(): void {
        if (this.state === TimerState.stopped) {
            throw new Error('Timer already stopped.');
        }

        this.stopInternal();
    }

    public getState(): TimerState {
        return this.state;
    }

    public restart(period: TimeSpan): void {
        Argument.isNotNullOrUndefined(period, 'period');

        this.tryStop();
        this.startInternal(period);
    }

    public resume(): void {
        if (this.state !== TimerState.suspended) {
            throw new Error('Timer is not suspended.');
        }

        manager.add(this);
        this.state = TimerState.started;
    }

    public suspend(): void {
        if (this.state !== TimerState.started) {
            throw new Error('Timer is not started.');
        }

        manager.remove(this);
        this.state = TimerState.suspended;
    }

    protected tryStop(): void {
        if (this.state !== TimerState.stopped) {
            this.stopInternal();
        }
    }

    protected abstract onUpdate(timeLeft: TimeSpan): void;

    private stopInternal(): void {
        if (this.state === TimerState.started) {
            manager.remove(this);
        }

        this.timeLeft = undefined;
        this.period = undefined;
        this.state = TimerState.stopped;
    }

    private startInternal(period: TimeSpan): void {
        this.period = period;
        this.timeLeft = period;

        manager.add(this);

        this.state = TimerState.started;
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
