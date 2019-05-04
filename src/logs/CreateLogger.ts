import {ILogSender} from "./ILogSender";
import {ILogger} from "./ILogger";
import {Logger} from "./Logger";

export function createLogger(sender: ILogSender): ILogger {
  return new Logger(sender);
}
