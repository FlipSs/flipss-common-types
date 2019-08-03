import {IDisposable, toFactory, tryDispose, using} from "../../../src/common/internal";

describe('functions', () => {
    describe('tryDispose', () => {
        it('Should dispose when object has dispose method', () => {
            const obj = new TestDisposable();

            tryDispose(obj);

            expect(obj.disposed).toBeTruthy();
        });

        it('Should not throw when object has dispose property', () => {
            const obj = {
                dispose: 17
            };

            expect(() => tryDispose(obj)).not.toThrow();
        });

        it('Should not throw when object is null or undefined', () => {
            expect(() => tryDispose(null)).not.toThrow();
            expect(() => tryDispose(undefined)).not.toThrow();
        });

        it('Should not throw when object is not disposable', () => {
            expect(() => tryDispose(123)).not.toThrow();
        });
    });

    describe('using', () => {
        let disposable: TestDisposable;

        beforeEach(() => disposable = new TestDisposable());

        it('Should dispose when no action', () => {
            using(disposable);
            expect(disposable.disposed).toBeTruthy();
        });

        it('Should dispose when not error action', () => {
            using(disposable, () => {
            });
            expect(disposable.disposed).toBeTruthy();
        });

        it('Should dispose when error action', () => {
            try {
                using(disposable, () => {
                    throw new Error();
                });
            } catch (e) {
            }

            expect(disposable.disposed).toBeTruthy();
        });

        it('Should throw error when disposable null or undefined', () => {
            expect(() => using(null)).toThrow();
            expect(() => using(undefined)).toThrow();
        });
    });

    describe('toFactory', () => {
        it('Should return factory when value provided', () => {
            const test = new Test();

            const factory = toFactory(Test, test);

            expect(factory).not.toBe(test);
            expect(factory()).toBe(test);
        });

        it('Factory should not be changed when provided', () => {
            const factory = () => new Test();

            const newFactory = toFactory(Test, factory);

            expect(newFactory).toBe(factory);
        });

        it('Should not throw when value null or undefined', () => {
            expect(() => toFactory(Test, null)).not.toThrow();
            expect(() => toFactory(Test, undefined)).not.toThrow();
        });

        it('Should throw when constructor null or undefined', () => {
            expect(() => toFactory(null, () => new Test())).toThrow();
            expect(() => toFactory(undefined, () => new Test())).toThrow();
        });
    });
});

class Test {
}

class TestDisposable implements IDisposable {
    private isDisposed = false;

    public get disposed(): boolean {
        return this.isDisposed;
    }

    public dispose(): void {
        this.isDisposed = true;
    }
}
