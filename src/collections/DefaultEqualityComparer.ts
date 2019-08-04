import {IEqualityComparer} from "./IEqualityComparer";

export class DefaultEqualityComparer<T> implements IEqualityComparer<T> {
    public equals(obj1: T, obj2: T): boolean {
        return Object.is(obj1, obj2);
    }
}
