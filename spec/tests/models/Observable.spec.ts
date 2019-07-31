import {IErrorObserver, IValueObserver, Observable} from "../../../src/models/internal";

describe('Observable', () => {
    let observable: TestObservable;

    beforeEach(() => {
        observable = new TestObservable();
    });

    it('Should notify about new value', () => {
        const observer = new TestValueObserver();
        observable.subscribe(observer);

        const value = 17;
        observable.nextValue(value);

        expect(observer.value).toEqual(value);
    });

    it('Should notify about new error', () => {
        const observer = new TestErrorObserver();
        observable.subscribe(observer);

        const error = new Error();
        observable.nextError(error);

        expect(observer.error).toEqual(error);
    });

    it('Should not notify when subscription is disposed', () => {
        const observer = new TestValueObserver();
        const subscription = observable.subscribe(observer);
        subscription.dispose();
        observable.nextValue(17);

        expect(observer.value).toBeUndefined();
    });

    it('Should not notify when disposed', () => {
        const observer = new TestValueObserver();

        observable.subscribe(observer);

        observable.dispose();
        observable.nextValue(2139);

        expect(observer.value).toBeUndefined();
    });

    it('Subscription should throw error when observable disposed', () => {
        const observer = new TestValueObserver();

        const subscription = observable.subscribe(observer);
        observable.dispose();

        expect(() => subscription.dispose()).toThrow();
    });

    it('Should throw error on second subscription', () => {
        const observer = new TestValueObserver();

        observable.subscribe(observer);
        expect(() => observable.subscribe(observer)).toThrow();
    });
});

class TestObservable extends Observable<number> {
    public constructor() {
        super();
    }

    public nextValue(value: number): void {
        this.next(value);
    }

    public nextError(error: Error): void {
        this.error(error);
    }
}

class TestValueObserver implements IValueObserver<number> {
    private lastValue: Readonly<number>;

    public get value(): Readonly<number> {
        return this.lastValue;
    }

    public onNext(value: Readonly<number>): void {
        this.lastValue = value;
    }
}

class TestErrorObserver implements IErrorObserver {
    private lastError: Readonly<Error>;

    public get error(): Readonly<Error> {
        return this.lastError;
    }

    public onError(error: Readonly<Error>): void {
        this.lastError = error;
    }
}
