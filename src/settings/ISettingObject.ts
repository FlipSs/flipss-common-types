import {IObservable} from "../models/internal";

export interface ISettingObject<TSettings> extends IObservable<void> {
    readonly value: Readonly<TSettings>;
}

