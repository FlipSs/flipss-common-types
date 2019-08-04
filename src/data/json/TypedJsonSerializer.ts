import {ITypedJsonSerializer, JsonSerializer} from "../internal";
import {buildObjectConverterUsingConstructor, IObjectConverter} from "../../converters/internal";
import {IConstructorWithoutParameters} from "../../common/internal";
import {Func} from "../../types/internal";

export class TypedJsonSerializer<T> extends JsonSerializer implements ITypedJsonSerializer<T> {
    private readonly converter: IObjectConverter<any, T>;

    public constructor(typeConstructor: IConstructorWithoutParameters<T>,
                       replacer?: Func<any, string, any>,
                       reviver?: Func<any, string, any>) {
        super(replacer, reviver);

        this.converter = buildObjectConverterUsingConstructor(typeConstructor).useDirectPropertyTransferring().create();
    }

    public deserialize(json: string): T {
        const rawResult = super.deserialize(json);

        return this.converter.convert(rawResult);
    }
}
