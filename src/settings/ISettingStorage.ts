import {IObservable} from "../models";

export interface ISettingStorage<TSettings> extends IObservable<TSettings> {
    refreshAsync(): Promise<void>;
}
