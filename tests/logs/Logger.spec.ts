import {Action} from "../../src/types/internal";
import {
    createLogger,
    ILogger,
    ILogMessage,
    ILogSender,
    LogMessageContainerError,
    LogLevel,
    LogMessageFactory
} from "../../src/logs/internal";
import Spy = jasmine.Spy;

describe('Logger', () => {
    let spy: Spy;
    let logger: ILogger;

    beforeEach(() => {
        const sender = new TestLogSender();
        spy = spyOn(sender, 'enqueue');
        logger = createLogger(sender);
    });

    function shouldCallSenderWithMessage(message: ILogMessage): void {
        expect(spy).toHaveBeenCalledWith(message);
    }

    function shouldThrowOnNullOrUndefined(action: Action<any>): void {
        it('Should throw when null or undefined', () => {
            expect(() => action(undefined)).toThrow();
            expect(() => action(null)).toThrow();
        });
    }

    function shouldSetDefaultLogLevelAndCategory(action: Action<string | Error>, logLevel: LogLevel): void {
        it('Should set default log level and category', () => {
            const message = 'test';

            action(message);

            shouldCallSenderWithMessage({
                message: message,
                category: 'unknown',
                level: logLevel,
                data: undefined
            });
        });
    }

    function logLevelMethodTest(logLevel: LogLevel, action: Action<string | Error, string, any>): void {
        const logLevelString = LogLevel[logLevel];

        describe(logLevelString, () => {
            it(`Should create log message with log level: ${logLevelString}`, () => {
                const message = Math.random() >= 0.5 ? 'test' : new Error('test');
                const category = 'test';
                const data = {test: 'test'};

                action(message, category, data);

                const expectedLogMessage = LogMessageFactory.create(message, 'test', logLevel, {test: 'test'});
                shouldCallSenderWithMessage(expectedLogMessage);
            });

            shouldThrowOnNullOrUndefined(m => action(m));
            shouldSetDefaultLogLevelAndCategory(m => action(m), logLevel);
        });
    }

    logLevelMethodTest(LogLevel.debug, (m, c, d) => logger.debug(m, c, d));
    logLevelMethodTest(LogLevel.info, (m, c, d) => logger.info(m, c, d));
    logLevelMethodTest(LogLevel.warn, (m, c, d) => logger.warn(m, c, d));
    logLevelMethodTest(LogLevel.error, (m, c, d) => logger.error(m, c, d));
    logLevelMethodTest(LogLevel.fatal, (m, c, d) => logger.fatal(m, c, d));

    describe('handle', () => {
        it('Should not change log message', () => {
            const message: ILogMessage = {
                message: 'test',
                category: 'category',
                level: LogLevel.debug
            };

            logger.handle(message);

            shouldCallSenderWithMessage(message);
        });

        shouldThrowOnNullOrUndefined((m) => logger.handle(m));
    });

    describe('raw', () => {
        it('Should create valid log message', () => {
            const error = new Error('test');
            const message: ILogMessage = LogMessageFactory.create(error, 'test', LogLevel.fatal);

            logger.raw(error, message.category, message.level);

            shouldCallSenderWithMessage(message);
        });

        it('Should take log message from LoggableError', () => {
            const message: ILogMessage = LogMessageFactory.create(new Error('test'), 'test', LogLevel.fatal);
            const loggableError = new LogMessageContainerError(message);

            logger.raw(loggableError);

            shouldCallSenderWithMessage(message);
        });

        shouldThrowOnNullOrUndefined(m => logger.raw(m));
        shouldSetDefaultLogLevelAndCategory(m => logger.raw(m), LogLevel.error);
    });
});

class TestLogSender implements ILogSender {
    public enqueue(logMessage: ILogMessage): void {
    }
}
