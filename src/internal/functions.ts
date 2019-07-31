import {Func, Type} from "../types/internal";
import {TypeUtils} from "../utils/internal";

export function toFactory<T>(value: T | Func<T>, type: Type<T>): Func<T> {
    return TypeUtils.is(value, type)
        ? () => value
        : value;
}
