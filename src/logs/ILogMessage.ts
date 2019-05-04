import {LogLevel} from "./LogLevel";

export interface ILogMessage {
  readonly level: LogLevel;
  readonly message: string;
  readonly category: string;
  readonly data?: any;
}
