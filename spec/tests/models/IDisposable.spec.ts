import {IDisposable, using} from "../../../src/models/IDisposable";

describe('IDisposable', () => {
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
