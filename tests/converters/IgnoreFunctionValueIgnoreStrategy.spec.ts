import {IgnoreFunctionValueIgnoreStrategy} from "../../src/converters/internal";

describe('IgnoreFunctionValueIgnoreStrategy', () => {
    let strategy: IgnoreFunctionValueIgnoreStrategy;

    beforeEach(() => strategy = new IgnoreFunctionValueIgnoreStrategy());

    it('Should ignore any functions', () => {
        expect(strategy.needToIgnore(() => {
        })).toBeTruthy();

        function test() {

        }

        expect(strategy.needToIgnore(test)).toBeTruthy();
        expect(strategy.needToIgnore(new Function())).toBeTruthy();
    });

    it('Should not ignore non function values', () => {
        expect(strategy.needToIgnore(null)).toBeFalsy();
        expect(strategy.needToIgnore(undefined)).toBeFalsy();
        expect(strategy.needToIgnore(NaN)).toBeFalsy();
        expect(strategy.needToIgnore(12)).toBeFalsy();
        expect(strategy.needToIgnore('123')).toBeFalsy();
        expect(strategy.needToIgnore(new Date())).toBeFalsy();
        expect(strategy.needToIgnore({})).toBeFalsy();
        expect(strategy.needToIgnore([])).toBeFalsy();
        expect(strategy.needToIgnore([() => {
        }])).toBeFalsy();
    });
});
