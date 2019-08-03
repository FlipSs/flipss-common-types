import {ILogger, ILogMessage, ILogSender, LoggableError, LogLevel, LogMessageFactory} from "./internal";
import {Argument, TypeUtils} from "../utils/internal";

const defaultCategory = 'unknown';
const defaultLogLevel = LogLevel.error;

export class Logger implements ILogger {
    public constructor(private readonly sender: ILogSender) {
        Argument.isNotNullOrUndefined(sender, 'sender');
    }

    public debug(rawMessage: string | Error, category?: string, data?: any): void {
        this.raw(rawMessage, category, LogLevel.debug, data);
    }

    public error(rawMessage: string | Error, category?: string, data?: any): void {
        this.raw(rawMessage, category, LogLevel.error, data);
    }

    public fatal(rawMessage: string | Error, category?: string, data?: any): void {
        this.raw(rawMessage, category, LogLevel.fatal, data);
    }

    public handle(logMessage: ILogMessage): void {
        Argument.isNotNullOrUndefined(logMessage, 'logMessage');

        this.sendMessage(logMessage);
    }

    public info(rawMessage: string | Error, category?: string, data?: any): void {
        this.raw(rawMessage, category, LogLevel.info, data);
    }

    public warn(rawMessage: string | Error, category?: string, data?: any): void {
        this.raw(rawMessage, category, LogLevel.warn, data);
    }

    public raw(rawMessage: string | Error, category?: string, level?: LogLevel, data?: any) {
        Argument.isNotNullOrUndefined(rawMessage, 'rawMessage');

        let logMessage: ILogMessage;
        if (TypeUtils.is(rawMessage, LoggableError)) {
            logMessage = rawMessage.log;
        } else {
            const logLevel = TypeUtils.isNullOrUndefined(level) ? defaultLogLevel : level;
            const logCategory = TypeUtils.isNullOrUndefined(category) ? defaultCategory : category;

            logMessage = LogMessageFactory.create(rawMessage, logCategory, logLevel, data);
        }

        this.sendMessage(logMessage);
    }

    private sendMessage(logMessage: ILogMessage): void {
        this.sender.enqueue(logMessage);
    }
}
