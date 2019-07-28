import {Action} from "../types";
import {TypeUtils} from "../utils";

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

