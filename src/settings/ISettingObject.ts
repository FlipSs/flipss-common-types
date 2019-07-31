import {IObservable} from "../models/internal";

export interface ISettingObject<TSettings> extends IObservable<TSettings> {
    readonly value: Readonly<TSettings>;
}

