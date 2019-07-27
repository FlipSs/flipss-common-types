import {Constructor} from "../../types/Constructor";

export class TypeUtils {
    public static isNullOrUndefined(arg: any): boolean {
        return arg == null;
    }

    public static isNumber(arg: any): arg is number {
        return !isNaN(arg) && (typeof arg === 'number' || this.is(arg, Number));
    }

    public static isString(arg: any): arg is string {
        return typeof arg === 'string' || this.is(arg, String);
    }

    public static is<T>(arg: any, type: Constructor<T>): arg is T {
        return arg instanceof type;
    }
}
