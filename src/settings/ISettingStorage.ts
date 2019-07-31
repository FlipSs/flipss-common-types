import {IObservable} from "../models/internal";

export interface ISettingStorage<TSettings> extends IObservable<TSettings> {
    refreshAsync(): Promise<void>;
}
