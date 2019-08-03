import {IObservable} from "../common/internal";

export interface ISettingStorage<TSettings> extends IObservable<TSettings> {
    refreshAsync(): Promise<void>;
}
