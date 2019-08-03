import {Action, Func, TypeConstructor} from "../types/internal";
import {Argument, TypeUtils} from "../utils/internal";
import {IDisposable} from "./internal";

export function tryDispose(target: any): void {
    if (TypeUtils.isNullOrUndefined(target)) {
        return;
    }

    const disposable = target as IDisposable;
    if (TypeUtils.is(disposable.dispose, Function)) {
        disposable.dispose();
    }
}

export function using(disposable: IDisposable, action?: Action<IDisposable>) {
    Argument.isNotNullOrUndefined(disposable, 'disposable');

    try {
        if (!TypeUtils.isNullOrUndefined(action)) {
            action(disposable);
        }
    } finally {
        disposable.dispose();
    }
}

export function toFactory<T>(constructor: TypeConstructor<T>, value: T | Func<T>): Func<T> {
    Argument.isNotNullOrUndefined(constructor, 'constructor');

    return TypeUtils.is(value, constructor)
        ? () => value
        : value;
}
