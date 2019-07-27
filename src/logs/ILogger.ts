import {LogLevel} from "./LogLevel";
import {ILogMessage} from "./ILogMessage";

export interface ILogger {
    raw(rawMessage: string | Error, category: string, level: LogLevel, data?: any);

    debug(rawMessage: string | Error, category: string, data?: any): void;

    info(rawMessage: string | Error, category: string, data?: any): void;

    warn(rawMessage: string | Error, category: string, data?: any): void;

    error(rawMessage: string | Error, category: string, data?: any): void;

    fatal(rawMessage: string | Error, category: string, data?: any): void;

    handle(logMessage: ILogMessage): void;
}
