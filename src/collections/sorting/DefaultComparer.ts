import {IComparer} from "../internal";

export class DefaultComparer<T> implements IComparer<T> {
    public compare(obj1: T, obj2: T): number {
        if (obj1 === obj2) {
            return 0;
        }

        if (obj1 < obj2) {
            return -1;
        }

        return 1;
    }
}
