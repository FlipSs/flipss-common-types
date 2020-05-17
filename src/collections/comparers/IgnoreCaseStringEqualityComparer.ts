import {IEqualityComparer} from "./IEqualityComparer";

export class IgnoreCaseStringEqualityComparer implements IEqualityComparer<string> {
    public equals(obj1: string, obj2: string): boolean {
        return obj1?.toUpperCase() === obj2?.toUpperCase();
    }
}
