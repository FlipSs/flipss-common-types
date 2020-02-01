import {IJsonSerializer} from "../internal";
import {Func} from "../../types/internal";

export class JsonSerializer implements IJsonSerializer {
    public constructor(private readonly _replacer?: Func<any, string, any>,
                       private readonly _reviver?: Func<any, string, any>) {
    }

    public serialize(value: any): string {
        return JSON.stringify(value, this._replacer);
    }

    public deserialize(json: string): any {
        return JSON.parse(json, this._reviver);
    }
}
