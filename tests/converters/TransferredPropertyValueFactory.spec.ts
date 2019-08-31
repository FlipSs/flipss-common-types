import {TransferredPropertyValueFactory} from "../../src/converters/internal";

describe('TransferredPropertyValueFactory', () => {
    it('Should take property value from source object', () => {
        const factory = new TransferredPropertyValueFactory('test');

        expect(factory.create({test: 123})).toEqual(123);
        expect(factory.create({test: null})).toBeNull();
        expect(factory.create({test1: 'test'})).toBeUndefined();
        expect(factory.create({test: undefined})).toBeUndefined();
        expect(factory.create({test: '123'})).toEqual('123');
    });
});
