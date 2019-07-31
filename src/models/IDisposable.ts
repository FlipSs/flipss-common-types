import {Action} from "../types/internal";
import {TypeUtils} from "../utils/internal";

export interface IDisposable {
    dispose(): void;
}

export function using(disposable: IDisposable, action: Action) {
    try {
        if (!TypeUtils.isNullOrUndefined(action)) {
            action();
        }
    } finally {
        disposable.dispose();
    }
}

