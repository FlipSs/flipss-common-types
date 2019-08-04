import {IReadOnlySet} from "../../collections/internal";
import {Argument} from "../../utils/internal";

export class PropertyNotAvailableError extends Error {
    public constructor(private readonly propertyNames: IReadOnlySet<string>) {
        super('Some properties not available.');

        Argument.isNotNullOrEmpty(propertyNames, 'propertyNames');

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = 'PropertyNotAvailableError';
    }

    public get notAvailablePropertyNames(): IReadOnlySet<string> {
        return this.propertyNames;
    }
}
