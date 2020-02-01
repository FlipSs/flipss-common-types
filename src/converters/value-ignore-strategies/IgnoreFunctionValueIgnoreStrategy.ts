import {IValueIgnoreStrategy} from "../internal";
import {TypeUtils} from "../../utils/TypeUtils";

export class IgnoreFunctionValueIgnoreStrategy implements IValueIgnoreStrategy {
    public needToIgnore(value: any): boolean {
        return TypeUtils.isFunction(value);
    }
}
