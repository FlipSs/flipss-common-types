import {ILogMessage} from "./internal";

export class LogMessageContainerError extends Error {
    public constructor(private readonly _logMessage: ILogMessage) {
        super(_logMessage && _logMessage.message);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = 'LogContainerError';
    }

    public get log(): ILogMessage {
        return this._logMessage;
    }
}
