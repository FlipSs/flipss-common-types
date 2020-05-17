import {IgnoreCaseStringEqualityComparer} from "../../../src/collections/comparers/IgnoreCaseStringEqualityComparer";

describe('IgnoreCaseStringEqualityComparer', () => {
    let comparer: IgnoreCaseStringEqualityComparer;

    beforeEach(() => {
        comparer = new IgnoreCaseStringEqualityComparer();
    });

    it('Should ignore string case', () => {
        expect(comparer.equals('', '')).toBeTrue();
        expect(comparer.equals('test', 'test')).toBeTrue();
        expect(comparer.equals('test', 'tEst')).toBeTrue();
    });
});
