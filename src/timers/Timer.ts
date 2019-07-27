import {Action} from "../types";
import {TimeSpan} from "./TimeSpan";
import {ITimer} from "./ITimer";
import {Argument} from "../utils";

class TimerIntervalManager {
    private readonly timerCallbacks: TimerCallback[];
    private currentIntervalId: number;

    public constructor() {
    }

    public registerCallback(callback: TimerCallback): void {
        this.timerCallbacks.push(callback);
    }

    public removeCallback(callback: TimerCallback): void {
    }

}

export type TimerCallback = Action<TimeSpan>;

export class Timer implements ITimer {
    private startedOn: number | null;
    private stoppedOn: number | null;

    public constructor(private readonly period: TimeSpan,
                       private readonly onPeriod: TimerCallback) {
        Argument.isNotNullOrUndefined(period, 'period');
        Argument.isNotNullOrUndefined(onPeriod, 'onPeriod');

        this.reset();
    }

    public reset(): void {
        this.startedOn = null;
        this.stoppedOn = null;
    }

    public start(): void {
        this.startedOn = new Date().getMilliseconds();
    }

    public stop(): void {
        this.stoppedOn = new Date().getMilliseconds();
    }
}
