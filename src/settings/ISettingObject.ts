import {IObservable} from "../common/internal";

export interface ISettingObject<TSettings> extends IObservable<TSettings> {
    readonly value: Readonly<TSettings>;
}

