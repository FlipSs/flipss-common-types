import {CreatedPropertyValueFactory} from "../../src/converters/internal";

describe('CreatedPropertyValueFactory', () => {
    it('Should return value from value factory', () => {
        const valueFactory = (n) => n * 3;
        const propertyValueFactory = new CreatedPropertyValueFactory<number, number>(valueFactory);

        expect(propertyValueFactory.create(2)).toEqual(valueFactory(2));
        expect(propertyValueFactory.create(-2)).toEqual(valueFactory(-2));
        expect(propertyValueFactory.create(0)).toEqual(valueFactory(0));
    });
});
