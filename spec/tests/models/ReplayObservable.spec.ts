import {IValueObserver, ReplayObservable} from "../../../src/models/internal";

const replayCount = Math.floor(Math.random() * 17);
const testValueCount = replayCount * 5;

describe('ReplayObservable', () => {
    let observable: TestReplayObservable;
    let values: string[];

    beforeEach(() => {
        observable = new TestReplayObservable();

        values = [];
        for (let i = 0; i < testValueCount; i++) {
            values.push(`value${i}`);
        }
    });

    it('Should replay specified value count', () => {
        const observer = new TestObserver();
        for (const value of values) {
            observable.nextValue(value);
        }

        observable.subscribe(observer);

        expect(observer.values.length).toBe(replayCount);
        expect(observer.values).toEqual(values.slice(testValueCount - replayCount));
    });
});

class TestObserver implements IValueObserver<string> {
    private receivedValues: string[] = [];

    public get values(): string[] {
        return this.receivedValues;
    }

    public onNext(value: Readonly<string>): void {
        this.receivedValues.push(value);
    }
}

class TestReplayObservable extends ReplayObservable<string> {
    public constructor() {
        super(replayCount);
    }

    public nextValue(value: string): void {
        this.next(value);
    }
}
