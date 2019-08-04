import {ITypedJsonSerializer, JsonSerializer} from "../internal";
import {IObjectConverter} from "../../converters/internal";
import {Func} from "../../types/internal";
import {Argument} from "../../utils/internal";

export class TypedJsonSerializer<T> extends JsonSerializer implements ITypedJsonSerializer<T> {
    public constructor(private readonly converter: IObjectConverter<any, T>,
                       replacer?: Func<any, string, any>,
                       reviver?: Func<any, string, any>) {
        super(replacer, reviver);

        Argument.isNotNullOrUndefined(this.converter, 'converter');
    }

    public deserialize(json: string): T {
        const rawResult = super.deserialize(json);

        return this.converter.convert(rawResult);
    }
}
