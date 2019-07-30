import {TypeUtils} from "../utils";
import {IgnoreFunctionValueIgnoreStrategy} from "./IgnoreFunctionValueIgnoreStrategy";

export class IgnoreNullAndUndefinedValueIgnoreStrategy extends IgnoreFunctionValueIgnoreStrategy {
    public needToIgnore(value: any): boolean {
        return super.needToIgnore(value) || TypeUtils.isNullOrUndefined(value);
    }
}
