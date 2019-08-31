import {TypedJsonSerializer} from "../../../src/data/internal";
import {buildObjectConverterUsingConstructor} from "../../../src/converters/internal";

describe('TypedJsonSerializer', () => {
    it('Should throw error if converter is null or undefined', () => {
        expect(() => new TypedJsonSerializer(null)).toThrow();
        expect(() => new TypedJsonSerializer(undefined)).toThrow();
    });

    it('Should convert result to target type', () => {
        const serializer = new TypedJsonSerializer<Serializable>(buildObjectConverterUsingConstructor<any, Serializable>(Serializable).useDirectPropertyTransferring().create());

        const json = serializer.serialize(new Serializable());
        const value = serializer.deserialize(json);

        expect(value instanceof Serializable).toBeTruthy();
        expect(value).toEqual(new Serializable());
    });
});

class Serializable {
    public value: number;

    public constructor() {
        this.value = 17;
    }
}
