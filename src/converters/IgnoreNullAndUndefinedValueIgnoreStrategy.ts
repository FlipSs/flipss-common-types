import {TypeUtils} from "../utils";
import {IValueIgnoreStrategy} from "./IValueIgnoreStrategy";

export class IgnoreNullAndUndefinedValueIgnoreStrategy implements IValueIgnoreStrategy {
    public needToIgnore(value: any): boolean {
        return TypeUtils.isNullOrUndefined(value);
    }
}
