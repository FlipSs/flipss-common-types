import {testObjectConverter} from "./common";
import {DirectPropertyTransferringObjectConverter} from "../../src/converters/DirectPropertyTransferringObjectConverter";
import {TimeSpan} from "../../src/time/internal";
import {Dictionary, Set} from "../../src/collections/internal";
import {StrictObjectConverterContextFactory} from "../../src/converters/contexts/StrictObjectConverterContextFactory";
import {IgnoreFunctionNullAndUndefinedValueIgnoreStrategy} from "../../src/converters/value-ignore-strategies/IgnoreFunctionNullAndUndefinedValueIgnoreStrategy";
import {ConstantPropertyValueFactory} from "../../src/converters/value-factories/ConstantPropertyValueFactory";

describe('DirectPropertyTransferringObjectConverter', () => {
    testObjectConverter(() => new DirectPropertyTransferringObjectConverter(undefined, new Set<string>()));

    it('Should transfer all properties by default if types match', () => {
        const converter = new DirectPropertyTransferringObjectConverter(new StrictObjectConverterContextFactory(
            () => new TestReferenceObject(),
            new IgnoreFunctionNullAndUndefinedValueIgnoreStrategy(),
            new Dictionary()
        ), new Set<string>());

        const expected = new TestReferenceObject();
        expected.property1 = 10;
        expected.property2 = '20';
        expected.property3 = true;
        expected.property4 = {
            object: {
                value: 213
            }
        };
        expected.property5 = TimeSpan.fromDays(1);

        expect(converter.convert({
            property1: 10,
            property2: '20',
            property3: true,
            property4: {
                test: 123,
                object: {
                    value: 213
                }
            },
            property5: TimeSpan.fromDays(1),
        })).toEqual(expected);
    });

    it('Should not transfer properties when types mismatch or reference object does not have that property', () => {
        const converter = new DirectPropertyTransferringObjectConverter(new StrictObjectConverterContextFactory(
            () => new TestReferenceObject(),
            new IgnoreFunctionNullAndUndefinedValueIgnoreStrategy(),
            new Dictionary()
        ), new Set<string>());

        expect(converter.convert({
            property1: '123',
            property2: 20,
            property3: new TestReferenceObject(),
            property4: null,
            property6: () => 5,
            property5: false
        })).toEqual(new TestReferenceObject());
    });

    it('Should ignore provided property names from transferring', () => {
        const converter = new DirectPropertyTransferringObjectConverter(new StrictObjectConverterContextFactory(
            () => new TestReferenceObject(),
            new IgnoreFunctionNullAndUndefinedValueIgnoreStrategy(),
            new Dictionary()
        ), new Set<string>(['property1', 'property2']));

        const expected = new TestReferenceObject();
        expected.property3 = false;
        expected.property4 = {
            object: {
                value: 213
            }
        };
        expected.property5 = TimeSpan.fromDays(1);

        expect(converter.convert({
            property1: 10,
            property2: '20',
            property3: false,
            property4: {
                test: 123,
                object: {
                    value: 213
                }
            },
            property5: TimeSpan.fromDays(1),
        })).toEqual(expected);
    });

    it('Value factories should overwrite transferred properties', () => {
        const converter = new DirectPropertyTransferringObjectConverter(new StrictObjectConverterContextFactory(
            () => new TestReferenceObject(),
            new IgnoreFunctionNullAndUndefinedValueIgnoreStrategy(),
            new Dictionary([{
                key: 'property1',
                value: new ConstantPropertyValueFactory(-213)
            }])
        ), new Set<string>());

        const expected = new TestReferenceObject();
        expected.property1 = -213;

        expect(converter.convert({
            property1: 10
        })).toEqual(expected);
    });

    it('Should transfer using custom source name provider function', () => {
        const converter = new DirectPropertyTransferringObjectConverter(new StrictObjectConverterContextFactory(
            () => new TestReferenceObject(),
            new IgnoreFunctionNullAndUndefinedValueIgnoreStrategy(),
            new Dictionary()
        ), new Set<string>(), n => `test${n}`);

        const expected = new TestReferenceObject();
        expected.property1 = 10;

        expect(converter.convert({
            testproperty1: 10
        })).toEqual(expected);
    });
});

class TestReferenceObject {
    public property1: number;
    public property2: string;
    public property3: boolean;
    public property4: Object;
    public property5: TimeSpan;
    public property6: Function | undefined;

    public constructor() {
        this.property1 = 1;
        this.property2 = '2';
        this.property3 = false;
        this.property4 = {
            object: {
                value: 2
            }
        };
        this.property5 = TimeSpan.fromHours(5);
        this.property6 = undefined;
    }
}
