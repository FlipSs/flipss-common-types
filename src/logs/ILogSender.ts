import {ILogMessage} from "./internal";

export interface ILogSender {
    enqueue(logMessage: ILogMessage): void;
}
