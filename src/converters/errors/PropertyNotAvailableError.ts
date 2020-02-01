import {IReadOnlySet} from "../../collections/internal";
import {Argument} from "../../utils/internal";

export class PropertyNotAvailableError extends Error {
    public constructor(private readonly _propertyNames: IReadOnlySet<string>) {
        super('Some properties are not available.');

        Argument.isNotNullOrEmpty(this._propertyNames, 'propertyNames');

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = 'PropertyNotAvailableError';
    }

    public get notAvailablePropertyNames(): IReadOnlySet<string> {
        return this._propertyNames;
    }
}
