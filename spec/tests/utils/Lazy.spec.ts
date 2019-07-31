import {ILazy, Lazy} from "../../../src/utils/internal";
import Spy = jasmine.Spy;

describe('Lazy', () => {
    const values: string[] = ['test1', 'test2', 'test3'];
    let spy: Spy;
    let lazy: ILazy<string>;

    beforeEach(() => {
        const type = new TestValueProvider(Array.from(values));
        spy = spyOn(type, 'getValue').and.callThrough();
        lazy = new Lazy<string>(() => type.getValue());
    });

    it('Should init value one time', () => {
        const expectedValue = values[0];
        for (let i = 0; i < values.length; i++) {
            expect(lazy.value).toEqual(expectedValue);
        }

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Should reset value', () => {
        expect(lazy.value).toEqual(values[0]);
        expect(spy).toHaveBeenCalled();

        spy.calls.reset();
        lazy.reset();

        expect(lazy.value).toEqual(values[1]);
        expect(spy).toHaveBeenCalled();
    });
});

class TestValueProvider {
    public constructor(private readonly values: string[]) {
    }

    public getValue(): string {
        return this.values.shift();
    }
}
