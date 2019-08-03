import {IDisposable, tryDispose, using} from "../../../src/common/internal";

describe('IDisposable', () => {
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
});

class TestDisposable implements IDisposable {
    private isDisposed = false;

    public get disposed(): boolean {
        return this.isDisposed;
    }

    public dispose(): void {
        this.isDisposed = true;
    }
}
