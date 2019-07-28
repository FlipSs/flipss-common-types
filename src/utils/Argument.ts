import {TypeUtils} from "./TypeUtils";
import {IReadOnlyCollection} from "../collections";

export class Argument {
    public static isNotNullOrUndefined(arg: any, parameterName: string): void {
        if (TypeUtils.isNullOrUndefined(arg)) {
            throw new Error(`${parameterName} can not be null or undefined.`);
        }
    }

    public static isNotNullOrEmpty(arg: string | any[] | IReadOnlyCollection<any>, parameterName: string): void {
        if (TypeUtils.isNullOrUndefined(arg) || arg.length === 0) {
            throw new Error(`${parameterName} can not be null or empty.`);
        }
    }
}
