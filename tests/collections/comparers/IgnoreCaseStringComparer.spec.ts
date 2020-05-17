import {IgnoreCaseStringComparer} from "../../../src/collections/comparers/IgnoreCaseStringComparer";

describe('IgnoreCaseStringComparer', () => {
    let comparer: IgnoreCaseStringComparer;

    beforeEach(() => {
        comparer = new IgnoreCaseStringComparer();
    })

    it('Should ignore string case', () => {
        expect(comparer.equals(null, null)).toBeTrue();
        expect(comparer.equals(undefined, null)).toBeFalse();
        expect(comparer.equals('', null)).toBeFalse();
        expect(comparer.equals('', '')).toBeTrue();
        expect(comparer.equals('test', 'test')).toBeTrue();
        expect(comparer.equals('test', 'tEst')).toBeTrue();
    });
});
