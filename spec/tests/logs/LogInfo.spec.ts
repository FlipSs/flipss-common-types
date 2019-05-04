import {ClassLogInfo, DisableMethodLogInfo, LoggableError, LogLevel, MethodLogInfo} from "../../../src/logs";
import {TypeUtils} from "../../../src/utils";

describe('LogInfo', () => {
  it('Should ignore getters', function () {
    const type = new Test();
    expect(() => type.test).toThrowMatching(e => !TypeUtils.is(e, LoggableError));
  });

  it('Should ignore constructors', () => {
    expect(() => new ErrorInConstructor()).toThrowMatching(e => !TypeUtils.is(e, LoggableError));
  });

  it('Should ignore methods with DisableMethodLogInfo decorator', () => {
    const type = new Test();
    expect(() => type.disableMethodLogInfo()).toThrowMatching(e => !TypeUtils.is(e, LoggableError));
  });

  it('Should wrap sync methods', () => {
    const type = new Test();
    expect(() => type.getTest()).toThrowMatching(e => TypeUtils.is(e, LoggableError) &&
        e.log.category === 'Class' &&
        e.log.level === LogLevel.warn &&
        e.log.message === 'test');
  });

  it('Should wrap async methods', async () => {
    const type = new Test();
    await expectAsync(new Promise((resolve, reject) => {
      type.getTestPromise().then(() => resolve(), reason => reject(reason));
    })).toBeRejectedWith(new LoggableError({
      category: 'Class',
      message: 'test',
      data: undefined,
      level: LogLevel.warn
    }));
  });

  it('Should use custom log info in methods with MethodLogInfo decorator', () => {
    const type = new Test();
    expect(() => type.methodLogInfo()).toThrowMatching(e => TypeUtils.is(e, LoggableError) &&
        e.log.category === 'Method' &&
        e.log.level === LogLevel.fatal);
  });
});

@ClassLogInfo({
  logLevel: LogLevel.warn,
  category: 'Class'
})
class Test {
  public get test(): any {
    throw new Error();
  }

  public getTest(): any {
    throw new Error('test');
  }

  public getTestPromise(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      reject('test');
    })
  }

  @MethodLogInfo({
    category: 'Method',
    logLevel: LogLevel.fatal
  })
  public methodLogInfo(): any {
    throw new Error();
  }

  @DisableMethodLogInfo()
  public disableMethodLogInfo(): any {
    throw new Error();
  }
}

@ClassLogInfo({
  category: 'Class',
  logLevel: LogLevel.error
})
class ErrorInConstructor {
  public constructor() {
    throw new Error();
  }
}
