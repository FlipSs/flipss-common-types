import {ITypedJsonSerializer, JsonSerializer} from "../internal";
import {IObjectConverter} from "../../converters/internal";
import {Func} from "../../types/internal";
import {Argument} from "../../utils/internal";

export class TypedJsonSerializer<T> extends JsonSerializer implements ITypedJsonSerializer<T> {
    public constructor(private readonly _converter: IObjectConverter<any, T>,
                       replacer?: Func<any, string, any>,
                       reviver?: Func<any, string, any>) {
        super(replacer, reviver);

        Argument.isNotNullOrUndefined(this._converter, 'converter');
    }

    public deserialize(json: string): T {
        const rawResult = super.deserialize(json);

        return this._converter.convert(rawResult);
    }
}
