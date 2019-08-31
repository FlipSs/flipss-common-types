import {testContextFactory} from "./common";
import {PropertyNotAvailableError, StrictObjectConverterContextFactory} from "../../src/converters/internal";
import {Dictionary} from "../../src/collections/internal";
import {TypeUtils} from "../../src/utils/TypeUtils";

describe('StrictObjectConverterContextFactory', () => {
    testContextFactory((rf, v) => new StrictObjectConverterContextFactory(rf, v, new Dictionary()))

    it('Should throw error when at least 1 property is unavailable', () => {
        const contextFactory = new StrictObjectConverterContextFactory(() => {
            return {
                test1: '213',
                test2: 213,
                test3: 21321,
            };
        }, undefined, new Dictionary([
            {
                key: 'test1',
                value: undefined
            },
            {
                key: 'test',
                value: null
            }
        ]));

        expect(() => contextFactory.create()).toThrowMatching(e =>
            TypeUtils.is(e, PropertyNotAvailableError) &&
            e.notAvailablePropertyNames.length === 1 &&
            e.notAvailablePropertyNames.getFirst() === 'test');
    });

    it('Should not throw error when all properties are available', () => {
        const contextFactory = new StrictObjectConverterContextFactory(() => {
            return {
                test1: '213',
                test2: 213,
                test3: 21321,
            };
        }, undefined, new Dictionary([
            {
                key: 'test1',
                value: undefined
            }
        ]));

        expect(() => contextFactory.create()).not.toThrow();
        expect(contextFactory.create().propertyValueFactories.keys).toEqual(['test1']);
    });
});
