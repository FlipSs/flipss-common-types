import {LogLevel} from "./internal";

export interface ILogMessage {
    readonly level: LogLevel;
    readonly message: string;
    readonly category: string;
    readonly data?: any;
}
