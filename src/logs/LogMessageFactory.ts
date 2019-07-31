import {ILogMessage, LogLevel} from "./internal";
import {TypeUtils} from "../utils/internal";

export class LogMessageFactory {
    public static create(rawMessage: string | Error, category: string, level: LogLevel, data?: any): ILogMessage {
        if (TypeUtils.isString(rawMessage)) {
            return this.createFromString(rawMessage, category, level, data);
        }

        return this.createFromError(rawMessage, category, level, data);
    }

    private static createFromError(error: Error, category: string, level: LogLevel, data?: any): ILogMessage {
        return {
            category,
            level,
            message: error.message,
            data: {
                additionalData: data,
                stack: error.stack
            }
        };
    }

    private static createFromString(message: string, category: string, level: LogLevel, data?: any): ILogMessage {
        return {
            category,
            level,
            message,
            data
        };
    }
}
