import {IgnoreFunctionNullAndUndefinedValueIgnoreStrategy} from "../../src/converters/internal";

describe('IgnoreFunctionNullAndUndefinedValueIgnoreStrategy', () => {
    let strategy: IgnoreFunctionNullAndUndefinedValueIgnoreStrategy;

    beforeEach(() => strategy = new IgnoreFunctionNullAndUndefinedValueIgnoreStrategy());

    it('Should ignore any functions, null and undefined', () => {
        expect(strategy.needToIgnore(() => {
        })).toBeTruthy();

        function test() {

        }

        expect(strategy.needToIgnore(test)).toBeTruthy();
        expect(strategy.needToIgnore(new Function())).toBeTruthy();
        expect(strategy.needToIgnore(null)).toBeTruthy();
        expect(strategy.needToIgnore(undefined)).toBeTruthy();
    });

    it('Should not ignore non function, non null and non undefined values', () => {
        expect(strategy.needToIgnore(1)).toBeFalsy();
        expect(strategy.needToIgnore('test')).toBeFalsy();
        expect(strategy.needToIgnore(new Date(12345))).toBeFalsy();
        expect(strategy.needToIgnore({})).toBeFalsy();
        expect(strategy.needToIgnore(NaN)).toBeFalsy();
        expect(strategy.needToIgnore([null])).toBeFalsy();
        expect(strategy.needToIgnore([() => {
        }])).toBeFalsy();
    });
});
