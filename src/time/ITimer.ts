import {TimeSpan} from "./TimeSpan";
import {TimerState} from "./TimerState";

export interface ITimer {
    getState(): TimerState;

    start(period: TimeSpan): void;

    stop(): void;

    restart(period: TimeSpan): void;

    suspend(): void;

    resume(): void;
}
