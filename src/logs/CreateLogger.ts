import {ILogger, ILogSender, Logger} from "./internal";

export function createLogger(sender: ILogSender): ILogger {
    return new Logger(sender);
}
