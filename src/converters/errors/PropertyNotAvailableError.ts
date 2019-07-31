import {IReadOnlyHashSet} from "../../collections/internal";
import {Argument} from "../../utils/internal";

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
