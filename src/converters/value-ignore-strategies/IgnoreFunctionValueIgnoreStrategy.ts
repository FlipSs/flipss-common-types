import {IValueIgnoreStrategy} from "../internal";

export class IgnoreFunctionValueIgnoreStrategy implements IValueIgnoreStrategy {
    public needToIgnore(value: any): boolean {
        return typeof value === 'function';
    }
}
