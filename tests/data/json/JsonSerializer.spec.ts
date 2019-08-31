import {JsonSerializer} from "../../../src/data/internal";

describe('JsonSerializer', () => {
    it('Should serialize and deserialize as JSON', () => {
        const replacer = (k, v) => {
            if (k === 'date' && v instanceof Date) {
                return v.toJSON();
            }

            return v;
        };

        const reviver = (k, v) => {
            if (k === 'date') {
                return new Date(v);
            }

            return v;
        };

        const serializer = new JsonSerializer(replacer, reviver);

        expect(serializer.serialize(new Serializable())).toEqual(JSON.stringify(new Serializable(), replacer));

        const json = `{ "value": "20", "date": "${new Date().toJSON()}"}`;
        expect(serializer.deserialize(json)).toEqual(JSON.parse(json, reviver));
    });
});

class Serializable {
    public value: string;
    public date: Date;

    public constructor() {
        this.value = 'test';
        this.date = new Date();
    }
}
