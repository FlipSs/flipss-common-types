import {
    IgnoreFunctionValueIgnoreStrategy,
    IObjectConverter,
    IObjectConverterContextFactory,
    IValueIgnoreStrategy,
    ReferenceObjectIsNullOrUndefinedError
} from "../../src/converters/internal";
import {Func} from "../../src/types/internal";
import {TypeUtils} from "../../src/utils/internal";

export function testContextFactory(contextFactoryFactory: Func<IObjectConverterContextFactory<any, any>, Func<any>, IValueIgnoreStrategy>): void {
    it('Should throw error when reference object is null or undefined', () => {
        expect(() => contextFactoryFactory(() => null).create()).toThrowMatching(e => TypeUtils.is(e, ReferenceObjectIsNullOrUndefinedError));
        expect(() => contextFactoryFactory(() => undefined).create()).toThrowMatching(e => TypeUtils.is(e, ReferenceObjectIsNullOrUndefinedError));
    });

    it('Should return object with passed value ignore strategy, available property names and reference object', () => {
        const valueIgnoreStrategy = new IgnoreFunctionValueIgnoreStrategy();
        const referenceObject = {
            test: 'test',
            func: () => {
            }
        };

        Object.defineProperty(referenceObject, 'test1', {
            value: '123',
            writable: false
        });

        const context = contextFactoryFactory(() => referenceObject, valueIgnoreStrategy).create();

        expect(context.availablePropertyNames.toArray()).toEqual(['test', 'func']);
        expect(context.valueIgnoreStrategy).toBe(valueIgnoreStrategy);
        expect(context.referenceObject).toBe(referenceObject);
    });
}

export function testObjectConverter(objectConverterFactory: Func<IObjectConverter<any, any>>): void {
    it('Should throw error when source is null or undefined', () => {
        const converter = objectConverterFactory();

        expect(() => converter.convert(null)).toThrow();
        expect(() => converter.convert(undefined)).toThrow();
    });
}
