import {TypeUtils} from "../utils/internal";
import {IgnoreFunctionValueIgnoreStrategy} from "./internal";

export class IgnoreNullAndUndefinedValueIgnoreStrategy extends IgnoreFunctionValueIgnoreStrategy {
    public needToIgnore(value: any): boolean {
        return super.needToIgnore(value) || TypeUtils.isNullOrUndefined(value);
    }
}
