import {TypeConstructor} from "../types/internal";

export class TypeUtils {
    public static isNullOrUndefined(argument: any): boolean {
        return argument == undefined;
    }

    public static isNumber(argument: any): argument is number {
        return !isNaN(argument) && (typeof argument === 'number' || this.is(argument, Number));
    }

    public static isString(argument: any): argument is string {
        return typeof argument === 'string' || this.is(argument, String);
    }

    public static is<T>(argument: any, constructor: TypeConstructor<T>): argument is T {
        return argument instanceof constructor;
    }
}
