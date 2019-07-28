import {Func, Type} from "../types";
import {TypeUtils} from "../utils";

export function toFactory<T>(value: T | Func<T>, type: Type<T>): Func<T> {
    return TypeUtils.is(value, type)
        ? () => value
        : value;
}
