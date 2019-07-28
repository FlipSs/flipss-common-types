import {TimeSpan} from "./TimeSpan";
import {TimerState} from "./TimerState";
import {IDisposable} from "../models";

export interface ITimer extends IDisposable {
    getState(): TimerState;

    start(period: TimeSpan): void;

    stop(): void;

    restart(period: TimeSpan): void;

    suspend(): void;

    resume(): void;
}
