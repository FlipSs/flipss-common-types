import {IObservable} from "../models";

export interface ISettingObject<TSettings> extends IObservable<void> {
    readonly value: Readonly<TSettings>;
}

