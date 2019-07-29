export class ReferenceObjectIsNullOrUndefinedError extends Error {
    public constructor() {
        super('Reference object is null or undefined.');

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = 'ReferenceObjectIsNullUndefinedError';
    }
}
