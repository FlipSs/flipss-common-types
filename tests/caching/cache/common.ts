import {ICache, ICacheConstructor} from "../../../src/caching/internal";
import {TimeSpan} from "../../../src/time/internal";
import Spy = jasmine.Spy;

export function testCache(cacheConstructor: ICacheConstructor<string, any>): void {
    let cache: ICache<string, any>;
    let checkingPeriod: TimeSpan;
    let period: TimeSpan;

    beforeEach(() => {
        checkingPeriod = TimeSpan.fromMilliseconds(500);
        period = TimeSpan.fromMilliseconds(300);
        cache = new cacheConstructor(() => period, () => checkingPeriod, [{
            key: 'test',
            value: 10
        }]);
    });

    afterEach(() => cache.dispose());

    it('Should fill initial values', () => {
        expect(cache.get('test')).toEqual(10);
    });

    describe('get', () => {
        it('Should return existing value', () => {
            expect(cache.get('test')).toEqual(10);
        });

        it('Should throw error when key does not exists', () => {
            expect(() => cache.get('213')).toThrow();
        });
    });

    describe('set', () => {
        it('Should add value if key does not exists', () => {
            cache.set('value', 123);

            expect(cache.get('value')).toEqual(123);
        });

        it('Should overwrite value if key exists', () => {
            cache.set('test', 15);

            expect(cache.get('test')).toEqual(15);
        });
    });

    describe('getOrAdd', () => {
        let spy: Spy;
        let valueFactory: ValueFactory;

        beforeEach(() => {
            valueFactory = new ValueFactory();

            spy = spyOn(valueFactory, 'create').and.callThrough();
        });

        it('Should throw error when valueFactory is null or undefined', () => {
            expect(() => cache.getOrAdd('test', null)).toThrow();
            expect(() => cache.getOrAdd('test', undefined)).toThrow();
        });

        it('Should return existing value if key exists', () => {
            expect(cache.getOrAdd('test', () => valueFactory.create())).toEqual(10);
            expect(spy).not.toHaveBeenCalled();
        });

        it('Should return value from value factory if key does not exists', () => {
            expect(cache.getOrAdd('1', () => valueFactory.create())).toEqual(12);
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('getOrAddAsync', () => {
        let spy: Spy;
        let valueFactory: ValueFactory;

        beforeEach(() => {
            valueFactory = new ValueFactory();

            spy = spyOn(valueFactory, 'create').and.callThrough();
        });

        it('Should throw error when valueFactory is null or undefined', async () => {
            await expectAsync(cache.getOrAddAsync('test', null)).toBeRejected();
            await expectAsync(cache.getOrAddAsync('test', undefined)).toBeRejected();
        });

        it('Should return existing value if key exists', async () => {
            await expectAsync(cache.getOrAddAsync('test', () => Promise.resolve(valueFactory.create()))).toBeResolvedTo(10);
            expect(spy).not.toHaveBeenCalled();
        });

        it('Should return value from value factory if key does not exists', async () => {
            await expectAsync(cache.getOrAddAsync('1', () => Promise.resolve(valueFactory.create()))).toBeResolvedTo(12);
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('containsKey', () => {
        it('Should return true if contains key', () => {
            expect(cache.containsKey('test')).toBeTruthy();
        });

        it('Should return false if does not contains key', () => {
            expect(cache.containsKey('1')).toBeFalsy();
        });
    });

    describe('getOrDefault', () => {
        it('Should return existing value', () => {
            expect(cache.getOrDefault('test')).toEqual(10);
        });

        it('Should return default value when key does not exists', () => {
            expect(cache.getOrDefault('213', 1)).toEqual(1);
        });
    });

    describe('clear', () => {
        it('Should clear cache', () => {
            cache.clear();

            expect(cache.containsKey('test')).toBeFalsy();
        });
    });

    describe('tryRemove', () => {
        it('Should remove value when exists', () => {
            cache.set('test', 0);

            expect(cache.tryRemove('test')).toBeTruthy();
            expect(cache.tryRemove('test')).toBeFalsy();
            expect(cache.tryRemove('t')).toBeFalsy();
        });
    });
}

class ValueFactory {
    public create(): number {
        return 12;
    }
}
