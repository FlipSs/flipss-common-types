import {testObjectConverter} from "./common";
import {
    ConstantPropertyValueFactory,
    CreatedPropertyValueFactory,
    IgnoreFunctionValueIgnoreStrategy,
    IPropertyValueFactory,
    ObjectConverter,
    OptionalObjectConverterContextFactory,
    TransferredPropertyValueFactory
} from "../../src/converters/internal";
import {TimeSpan} from "../../src/time/internal";
import {Dictionary} from "../../src/collections/internal";

describe('ObjectConverter', () => {
    testObjectConverter(() => new ObjectConverter(undefined));

    it('Should return proper result', () => {
        const converter = new ObjectConverter<any, TestReferenceObject>(new OptionalObjectConverterContextFactory(
            () => new TestReferenceObject(),
            new IgnoreFunctionValueIgnoreStrategy(),
            new Dictionary<string, IPropertyValueFactory<any, any>>([
                {
                    key: 'test',
                    value: new ConstantPropertyValueFactory<any, string>('test1')
                },
                {
                    key: 'test1',
                    value: new TransferredPropertyValueFactory<any, number>('numb')
                },
                {
                    key: 'func',
                    value: new TransferredPropertyValueFactory<any, Function>('func')
                },
                {
                    key: 'test2',
                    value: new CreatedPropertyValueFactory<any, TimeSpan>(s => TimeSpan.fromMilliseconds(s['time'] as number))
                }
            ])));

        const source = {
            test: 123,
            numb: 17,
            time: 123,
            func: () => {
            }
        };

        const converted = converter.convert(source);

        expect(converted.test).toEqual('test1');
        expect(converted.test4).toBeTruthy();
        expect(converted.test1).toEqual(source.numb);
        expect(converted.test2.milliseconds).toEqual(source.time);
        expect(converted.func).toBeNull();
    });
});

class TestReferenceObject {
    public test: string;
    public test1: number;
    public test2: TimeSpan;
    public test4: boolean;
    public func: Function | null;

    public constructor() {
        this.test = 'test';
        this.test1 = 123;
        this.test2 = TimeSpan.fromMilliseconds(100);
        this.test4 = true;
        this.func = null;
    }
}
