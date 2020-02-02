import {DefaultEqualityComparer, IEqualityComparer, ReadOnlyCollection} from "./internal";
import {Predicate} from "../types/internal";
import {TypeUtils} from "../utils/TypeUtils";

export function isArrayOrCollection<T>(values: Iterable<T>): values is Array<T> | ReadOnlyCollection<T> {
    return isArray(values) || isCollection(values);
}

export function isArray<T>(values: Iterable<T>): values is Array<T> {
    return TypeUtils.is(values, Array);
}

export function isCollection<T>(values: Iterable<T>): values is ReadOnlyCollection<T> {
    return TypeUtils.is(values, ReadOnlyCollection);
}

export function getEqualityComparer<T>(comparer?: IEqualityComparer<T>): IEqualityComparer<T> {
    return comparer || new DefaultEqualityComparer<T>();
}

export function toArray<T>(values: Iterable<T>): T[] {
    let result: T[];
    if (isArray(values)) {
        result = values;
    } else if (isCollection(values)) {
        result = values.getArray();
    } else {
        result = Array.from(values);
    }

    return result;
}

export function tryRemoveValueFromArray<T>(array: T[], predicate: Predicate<T>): boolean {
    const itemIndex = array.findIndex(i => predicate(i));
    if (itemIndex < 0) {
        return false;
    }

    array.splice(itemIndex, 1);

    return true;
}
