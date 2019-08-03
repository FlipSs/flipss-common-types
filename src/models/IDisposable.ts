import {Action} from "../types/internal";
import {Argument, TypeUtils} from "../utils/internal";

export interface IDisposable {
    dispose(): void;
}

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

