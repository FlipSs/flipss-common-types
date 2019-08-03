import {IJsonSerializer} from "../internal";
import {Func} from "../../types/internal";

export class JsonSerializer<T> implements IJsonSerializer<T> {
    public constructor(private readonly replacer?: Func<any, string, any>,
                       private readonly reviver?: Func<any, string, any>) {
    }

    public deserialize(json: string): T {
        return JSON.parse(json, this.reviver) as T;
    }

    public serialize(value: T): string {
        return JSON.stringify(value, this.replacer);
    }
}
