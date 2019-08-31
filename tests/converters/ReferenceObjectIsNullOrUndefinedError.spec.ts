import {ReferenceObjectIsNullOrUndefinedError} from "../../src/converters/internal";

describe('ReferenceObjectIsNullOrUndefinedError', () => {
    it('Should set ReferenceObjectIsNullOrUndefinedError prototype', () => {
        const error = new ReferenceObjectIsNullOrUndefinedError();

        expect(error instanceof ReferenceObjectIsNullOrUndefinedError).toBeTruthy();
    });
});
