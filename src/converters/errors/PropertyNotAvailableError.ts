import {IReadOnlyHashSet} from "../../collections";
import {Argument} from "../../utils";

export class PropertyNotAvailableError extends Error {
    public constructor(private readonly propertyNames: IReadOnlyHashSet<string>) {
        super('Some properties not available.');

        Argument.isNotNullOrEmpty(propertyNames, 'propertyNames');

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = 'PropertyNotAvailableError';
    }

    public get notAvailablePropertyNames(): IReadOnlyHashSet<string> {
        return this.propertyNames;
    }
}
