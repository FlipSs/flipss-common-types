import {JsonSerializer} from "../../../src/data/internal";

describe('JsonSerializer', () => {
    it('Should replace and revive specified keys', () => {
        const serializer = new JsonSerializer((k, v) => {
            if (k === 'date') {
                return new Date(v).toJSON();
            }

            return v;
        }, (k, v) => {
            if (k === 'date') {
                return new Date(v);
            }

            return v;
        });

        const test = {
            date: new Date(),
            value: 17,
            test: {
                test: 15
            }
        };

        const serialized = serializer.serialize(test);
        expect(serialized).toContain(test.date.toJSON());

        const newTest = serializer.deserialize(serialized);
        expect(newTest).toEqual(test);
    });
});
