import {TypeUtils} from "./internal";
import {IReadOnlyCollection} from "../collections/internal";

export class Argument {
    public static isNotNullOrUndefined(argument: any, parameterName: string): void {
        if (TypeUtils.isNullOrUndefined(argument)) {
            throw new Error(`${parameterName} can not be null or undefined`);
        }
    }

    public static isNotNullOrEmpty(argument: string | any[] | IReadOnlyCollection<any>, parameterName: string): void {
        if (TypeUtils.isNullOrUndefined(argument) || argument.length === 0) {
            throw new Error(`${parameterName} can not be null or empty`);
        }
    }
}
