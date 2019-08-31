import {CustomLogInfo, LoggableError, LogInfo, LogInfoDisable, LogLevel} from "../../src/logs/internal";
import {TypeUtils} from "../../src/utils/internal";

const category = 'Class';
const logLevel = LogLevel.warn;
const message = 'test';
const customLogInfoCategory = 'Custom';
const customLogInfoLogLevel = LogLevel.fatal;

describe('LogInfo', () => {
    let type: Test;

    beforeEach(() => {
        type = new Test();
    });

    it('Should ignore getters', function () {
        expect(() => type.test).not.toThrowMatching(e => TypeUtils.is(e, LoggableError));
    });

    it('Should ignore constructors', () => {
        expect(() => new ErrorInConstructor()).not.toThrowMatching(e => TypeUtils.is(e, LoggableError));
    });

    it('Should ignore methods with LogInfoDisable decorator', () => {
        expect(() => type.logInfoDisable()).not.toThrowMatching(e => TypeUtils.is(e, LoggableError));
    });

    it('Should throw LoggableError when error thrown', () => {
        expect(() => type.getTest()).toThrowMatching(e =>
            TypeUtils.is(e, LoggableError) &&
            e.log.category === category &&
            e.log.level === logLevel &&
            e.log.message === message);
    });

    it('Should throw LoggableError when promise rejected', async () => {
        await expectAsync(type.getTestPromise()).toBeRejectedWith(new LoggableError({
            category: category,
            message: message,
            data: undefined,
            level: logLevel
        }));
    });

    it('Should use custom log info in methods with CustomLogInfo decorator', () => {
        expect(() => type.methodLogInfo()).toThrowMatching(e =>
            TypeUtils.is(e, LoggableError) &&
            e.log.category === customLogInfoCategory &&
            e.log.level === customLogInfoLogLevel);
    });

    it('Should ignore non writable properties', () => {
        expect(() => type.nonWritable()).not.toThrowMatching(e => TypeUtils.is(e, LoggableError));
    });

    it('Should do nothing when LoggableErrorThrown', () => {
        const error = new LoggableError(undefined);

        expect(() => type.throwLoggableError(error)).toThrow(error);
    });
});

@LogInfo({
    logLevel: logLevel,
    category: category
})
class Test {
    // noinspection JSMethodCanBeStatic
    public get test(): any {
        throw new Error();
    }

    // noinspection JSMethodCanBeStatic
    public getTest(): any {
        throw new Error('test');
    }

    // noinspection JSMethodCanBeStatic
    public getTestPromise(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            reject('test');
        })
    }

    @CustomLogInfo({
        category: customLogInfoCategory,
        logLevel: customLogInfoLogLevel
    })
    public methodLogInfo(): any {
        throw new Error();
    }

    @LogInfoDisable()
    public logInfoDisable(): any {
        throw new Error();
    }

    @nonWritable()
    public nonWritable(): never {
        throw new Error('test');
    }

    public throwLoggableError(error: LoggableError): never {
        throw error;
    }
}

@LogInfo({
    category: category,
    logLevel: LogLevel.error
})
class ErrorInConstructor {
    public constructor() {
        throw new Error();
    }
}

function nonWritable() {
    return (target: Object, propertyName: string, propertyDescriptor: PropertyDescriptor) => {
        propertyDescriptor.writable = false;
    };
}
