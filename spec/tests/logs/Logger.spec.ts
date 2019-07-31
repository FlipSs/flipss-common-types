import {Action} from "../../../src/types/internal";
import {createLogger, ILogger, ILogMessage, ILogSender, LogLevel, LogMessageFactory} from "../../../src/logs/internal";
import Spy = jasmine.Spy;

describe('Logger', () => {
    let spy: Spy;
    let logger: ILogger;
    beforeEach(() => {
        const sender = new LogSender();
        spy = spyOn(sender, 'enqueue');
        logger = createLogger(sender);
    });

    function shouldBeMessage(message: ILogMessage) {
        expect(spy).toHaveBeenCalledWith(message);
    }

    function shouldBeRaw(rawMessage: string | Error, logLevel: LogLevel, action: Action<ILogMessage>): void {
        it(`Should be ${LogLevel[logLevel]} message`, () => {
            const logMessage = LogMessageFactory.create(rawMessage, 'test', logLevel, {test: 'test'});
            action(logMessage);
            shouldBeMessage(logMessage);
        });
    }

    shouldBeRaw('test', LogLevel.debug, m => logger.debug(m.message, m.category, m.data));
    shouldBeRaw('test', LogLevel.info, m => logger.info(m.message, m.category, m.data));
    shouldBeRaw(new Error('test'), LogLevel.warn, m => logger.warn(m.message, m.category, m.data));
    shouldBeRaw(new Error('test'), LogLevel.error, m => logger.error(m.message, m.category, m.data));
    shouldBeRaw(new Error('test'), LogLevel.fatal, m => logger.fatal(m.message, m.category, m.data));

    it('Should equals passed message', () => {
        const message: ILogMessage = {
            message: 'test',
            category: 'category',
            level: LogLevel.debug
        };

        logger.handle(message);
        shouldBeMessage(message);
    });

    it('Raw parameters should equals', () => {
        const error = new Error('test');
        const message: ILogMessage = LogMessageFactory.create(error, 'test', LogLevel.fatal);
        logger.raw(error, message.category, message.level);
        shouldBeMessage(message);
    });
});

class LogSender implements ILogSender {
    public enqueue(logMessage: ILogMessage): void {
    }
}
