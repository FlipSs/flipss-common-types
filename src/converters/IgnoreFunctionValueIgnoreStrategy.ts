import {IValueIgnoreStrategy} from "./IValueIgnoreStrategy";

export class IgnoreFunctionValueIgnoreStrategy implements IValueIgnoreStrategy {
    public needToIgnore(value: any): boolean {
        return typeof value === 'function';
    }
}
