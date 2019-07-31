import {Action} from "../types/internal";
import {Argument, TypeUtils} from "../utils/internal";

export interface IDisposable {
    dispose(): void;
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

