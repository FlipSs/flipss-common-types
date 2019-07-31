import {ILogMessage, LogLevel, LogMessageFactory} from "../../../src/logs/internal";

describe('LogMessageFactory', () => {
    it('On string message', () => {
        const logMessage: ILogMessage = {
            message: 'test',
            level: LogLevel.warn,
            category: 'test',
            data: undefined
        };
        expect(LogMessageFactory.create(logMessage.message, logMessage.category, logMessage.level, logMessage.data)).toEqual(logMessage);
    });

    it('On Error message', () => {
        const error = new Error('test');
        const data = {test: 'test'};
        const logMessage: ILogMessage = {
            message: error.message,
            level: LogLevel.warn,
            category: 'test',
            data: {
                stack: error.stack,
                additionalData: data
            }
        };

        expect(LogMessageFactory.create(error, logMessage.category, logMessage.level, data)).toEqual(logMessage);
    });
});
