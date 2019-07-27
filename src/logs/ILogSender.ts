import {ILogMessage} from "./ILogMessage";

export interface ILogSender {
    enqueue(logMessage: ILogMessage): void;
}
