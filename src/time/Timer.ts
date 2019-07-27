import {Action} from "../types";
import {TimeSpan} from "./TimeSpan";
import {ITimer} from "./ITimer";
import {Argument, TypeUtils} from "../utils";
import {Collection, ICollection} from "../collections";

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

class Timer implements ITimer {
    private isStarted: boolean;
    private timeLeft: TimeSpan;

    public constructor(private readonly period: TimeSpan,
                       private readonly callback: TimerCallback) {
        this.timeLeft = this.period;
        this.isStarted = false;
    }

    public update(period: TimeSpan): void {
        const timeLeft = this.timeLeft.subtract(period);

        this.callback(timeLeft);

        this.timeLeft = timeLeft;
    }

    public reset(): void {
        if (this.isStarted) {
            manager.remove(this);

            this.isStarted = false;
        }

        this.timeLeft = this.period;
    }

    public start(): void {
        if (this.isStarted) {
            throw new Error('Timer already started.');
        }

        manager.add(this);

        this.isStarted = true;
    }

    public stop(): void {
        if (!this.isStarted) {
            throw new Error('Timer is not started.');
        }

        manager.remove(this);

        this.isStarted = false;
    }
}

export type TimerCallback = Action<TimeSpan>;

export function createTimer(period: TimeSpan, callback: TimerCallback): ITimer {
    Argument.isNotNullOrUndefined(this.period, 'period');
    Argument.isNotNullOrUndefined(this.callback, 'callback');

    return new Timer(period, callback);
}
