import {IValueIgnoreStrategy} from "./IValueIgnoreStrategy";

export class IgnoreNothingValueIgnoreStrategy implements IValueIgnoreStrategy {
    public needToIgnore(value: any): boolean {
        return false;
    }
}
