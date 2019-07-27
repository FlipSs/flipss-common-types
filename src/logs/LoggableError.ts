import {ILogMessage} from "./ILogMessage";

export class LoggableError extends Error {
    public constructor(private readonly logMessage: ILogMessage) {
        super(logMessage && logMessage.message);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = 'LoggableError';
    }

    public get log(): ILogMessage {
        return this.logMessage;
    }
}
