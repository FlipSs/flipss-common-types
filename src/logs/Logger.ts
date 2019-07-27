import {ILogSender} from "./ILogSender";
import {Argument, TypeUtils} from "../utils";
import {LogLevel} from "./LogLevel";
import {ILogMessage} from "./ILogMessage";
import {LogMessageFactory} from "./LogMessageFactory";
import {ILogger} from "./ILogger";
import {LoggableError} from "./LoggableError";

export class Logger implements ILogger {
    public constructor(private readonly sender: ILogSender) {
        Argument.isNotNullOrUndefined(sender, 'sender');
    }

    public debug(rawMessage: string | Error, category: string, data?: any): void {
        this.raw(rawMessage, category, LogLevel.debug, data);
    }

    public error(rawMessage: string | Error, category: string, data?: any): void {
        this.raw(rawMessage, category, LogLevel.error, data);
    }

    public fatal(rawMessage: string | Error, category: string, data?: any): void {
        this.raw(rawMessage, category, LogLevel.fatal, data);
    }

    public handle(logMessage: ILogMessage): void {
        this.sender.enqueue(logMessage);
    }

    public info(rawMessage: string | Error, category: string, data?: any): void {
        this.raw(rawMessage, category, LogLevel.info, data);
    }

    public warn(rawMessage: string | Error, category: string, data?: any): void {
        this.raw(rawMessage, category, LogLevel.warn, data);
    }

    public raw(rawMessage: string | Error, category: string, level: LogLevel, data?: any) {
        let logMessage: ILogMessage;
        if (TypeUtils.is(rawMessage, LoggableError)) {
            logMessage = rawMessage.log;
        } else {
            logMessage = LogMessageFactory.create(rawMessage, category, level, data);
        }

        this.handle(logMessage);
    }
}
