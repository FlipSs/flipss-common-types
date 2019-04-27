import {ISettingStorage} from './ISettingStorage';
import {ISettingLoader} from './ISettingLoader';
import {ReplaySubject, Subject} from "rxjs";
import {Argument} from "../utils/Argument";

export class SettingStorage<TSettings> implements ISettingStorage<TSettings> {
  public readonly value: Subject<TSettings>;

  public constructor(private readonly loader: ISettingLoader<TSettings>) {
    Argument.isNotNullOrUndefined(loader, 'ISettingLoader');

    this.value = new ReplaySubject<TSettings>(1);
  }

  public async refreshAsync(): Promise<void> {
    const loadedValue = await this.loader.loadAsync();

    this.value.next(loadedValue);
  }
}
