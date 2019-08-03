import {TypeConstructor, Func} from "../types/internal";
import {TypeUtils} from "../utils/internal";

export function toFactory<T>(value: T | Func<T>, constructor: TypeConstructor<T>): Func<T> {
    return TypeUtils.is(value, constructor)
        ? () => value
        : value;
}
