import {Subject} from "rxjs";

export interface ISettingObject<TSettings> {
  readonly value: Readonly<TSettings>;
  readonly valueUpdated?: Subject<void>;
}

