import {ISettingObject} from './ISettingObject';
import {ISettingStorage} from './ISettingStorage';
import {ISettingObjectErrorListener} from './ISettingObjectErrorListener';
import {ReplaySubject, Subject} from "rxjs";
import {Argument} from "../utils";

export abstract class DynamicSettingObject<TSettings, TStorageSettings> implements ISettingObject<TSettings> {
  public readonly valueUpdated: Subject<void>;

  private currentValue: TSettings;

  protected constructor(storage: ISettingStorage<TStorageSettings>,
                        private readonly errorListener: ISettingObjectErrorListener<TSettings>) {
    Argument.isNotNullOrUndefined(storage, 'ISettingStorage');
    Argument.isNotNullOrUndefined(errorListener, 'ISettingObjectErrorListener');

    this.valueUpdated = new ReplaySubject<void>(1);

    storage.value.subscribe(storageSettings => {
      this.setValue(storageSettings);
      this.valueUpdated.next();
    });
  }

  public get value(): Readonly<TSettings> {
    return this.currentValue;
  }

  protected abstract get objectName(): string;

  protected abstract getFromStorage(storageSettings: TStorageSettings): TSettings;

  protected abstract getDefaults(): TSettings;

  protected isValid(settings: TSettings): boolean {
    return settings != null;
  }

  private setValue(storageSettings: TStorageSettings): void {
    const settingFromStorage = this.getFromStorage(storageSettings);

    if (!this.isValid(settingFromStorage)) {
      this.errorListener.onNotValidSettings(this.objectName, settingFromStorage);

      if (!this.currentValue) {
        this.currentValue = this.getDefaults();
      }
    } else {
      this.currentValue = settingFromStorage;
    }
  }
}
