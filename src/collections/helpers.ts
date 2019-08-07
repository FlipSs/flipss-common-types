import {DefaultEqualityComparer, IEqualityComparer} from "./internal";
import {Predicate} from "../types/internal";

export function getEqualityComparer<T>(comparer?: IEqualityComparer<T>): IEqualityComparer<T> {
    return comparer || new DefaultEqualityComparer<T>();
}

export function containsValue<T>(array: T[], value: T, equalityComparer: IEqualityComparer<T>): boolean {
    return contains(array, i => equalityComparer.equals(i, value));
}

export function contains<T>(array: T[], predicate: Predicate<T>): boolean {
    return array.some(v => predicate(v));
}

export function tryRemoveItem<T>(array: T[], predicate: Predicate<T>): boolean {
    const itemIndex = array.findIndex(i => predicate(i));
    if (itemIndex < 0) {
        return false;
    }

    array.splice(itemIndex, 1);

    return true;
}
