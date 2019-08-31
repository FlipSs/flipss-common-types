import {testContextFactory} from "./common";
import {OptionalObjectConverterContextFactory} from "../../src/converters/internal";
import {Dictionary} from "../../src/collections/internal";

describe('OptionalObjectConverterContextFactory', () => {
    testContextFactory((rf, v) => new OptionalObjectConverterContextFactory(rf, v, new Dictionary()));

    it('Should return value factories only for available properties', () => {
        const contextFactory = new OptionalObjectConverterContextFactory<any, any>(() => {
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

        expect(contextFactory.create().propertyValueFactories.keys).toEqual(['test1']);
    });
});
