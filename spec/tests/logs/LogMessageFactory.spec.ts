import {ILogMessage, LogLevel, LogMessageFactory} from "../../../src/logs/internal";

describe('LogMessageFactory', () => {
    describe('create', () => {
        it('Should create valid log message from string', () => {
            const validLogMessage: ILogMessage = {
                message: 'test',
                level: LogLevel.warn,
                category: 'test',
                data: undefined
            };

            expect(LogMessageFactory.create(validLogMessage.message, validLogMessage.category, validLogMessage.level, validLogMessage.data)).toEqual(validLogMessage);
        });

        it('Should create valid log message from error', () => {
            const error = new Error('test');
            const data = {test: 'test'};

            const validLogMessage: ILogMessage = {
                message: error.message,
                level: LogLevel.warn,
                category: 'test',
                data: {
                    stack: error.stack,
                    additionalData: data
                }
            };

            expect(LogMessageFactory.create(error, validLogMessage.category, validLogMessage.level, data)).toEqual(validLogMessage);
        });
    });
});
