import {Subject} from "rxjs";

export interface ISettingStorage<TSettings> {
    readonly value: Subject<TSettings>;

    refreshAsync(): Promise<void>;
}
