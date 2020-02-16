import {IResolvablePromiseContainer, ResolvablePromiseContainer} from "../../src/utils/internal";

describe('ResolvablePromiseContainer', () => {
    let container: IResolvablePromiseContainer<number>;

    beforeEach(() => {
        container = new ResolvablePromiseContainer();
    });

    it('Promise should not be null or undefined', () => {
        expect(container.promise).toBeDefined();
        expect(container.promise).not.toBeNull();
    });

    it('Promise should be resolved when resolve called', async () => {
        let resolved = false;

        const promise = container.promise.then(r => {
            expect(resolved).toBeTruthy();
            expect(r).toBe(5);
        });

        resolved = true;
        container.resolve(5);

        await promise;
    });

    it('Promise should be rejected when reject called', async () => {
        let rejected = false;

        const promise = container.promise.catch(r => {
            expect(rejected).toBeTruthy();
            expect(r).toBe('Test');
        });

        rejected = true;
        container.reject('Test');

        await promise;
    });
});
