import {ObjectConverterBuilder} from "../../src/converters/ObjectConverterBuilder";

describe('ObjectConverterBuilder', () => {
    describe('set', () => {
        it('Should throw error when valueFactory is null or undefined', () => {
            const builder = new ObjectConverterBuilder<Test, Test>(() => null);

            expect(() => builder.set<string>(null, 'test')).toThrow();
            expect(() => builder.set<string>(undefined, 'test')).toThrow();
        });

        it('Should throw error when targetPropertyName is null or undefined', () => {
            const builder = new ObjectConverterBuilder<Test, Test>(() => null);

            expect(() => builder.set<string>(() => '', null)).toThrow();
            expect(() => builder.set<string>(() => '', undefined)).toThrow();
        });
    });

    describe('setConstant', () => {
        it('Should throw error when value is null or undefined', () => {
            const builder = new ObjectConverterBuilder<Test, Test>(() => null);

            expect(() => builder.setConstant<string>(null, 'test')).toThrow();
            expect(() => builder.setConstant<string>(undefined, 'test')).toThrow();
        });

        it('Should throw error when targetPropertyName is null or undefined', () => {
            const builder = new ObjectConverterBuilder<Test, Test>(() => null);

            expect(() => builder.setConstant<string>('', null)).toThrow();
            expect(() => builder.setConstant<string>('', undefined)).toThrow();
        });
    });

    describe('setProperty', () => {
        it('Should throw error when sourcePropertyName is null or undefined', () => {
            const builder = new ObjectConverterBuilder<Test, Test>(() => null);

            expect(() => builder.setProperty<string>(null, 'test')).toThrow();
            expect(() => builder.setProperty<string>(undefined, 'test')).toThrow();
        });

        it('Should throw error when targetPropertyName is null or undefined', () => {
            const builder = new ObjectConverterBuilder<Test, Test>(() => null);

            expect(() => builder.setProperty<string>('test', null)).toThrow();
            expect(() => builder.setProperty<string>('test', undefined)).toThrow();
        });
    });
});

class Test {
    public test: string;
}
