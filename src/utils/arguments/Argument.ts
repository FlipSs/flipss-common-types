import {TypeUtils} from "..";

export class Argument {
    public static isNotNullOrUndefined(arg: any, parameterName: string): void {
        if (TypeUtils.isNullOrUndefined(arg)) {
            throw new Error(`${parameterName} can not be null or undefined.`);
        }
    }

    public static isNotNullOrEmpty(arg: string, parameterName: string): void {
        if (TypeUtils.isNullOrUndefined(arg) || arg === '') {
            throw new Error(`${parameterName} can not be null or empty.`);
        }
    }
}
