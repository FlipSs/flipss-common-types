import {ISettingObject} from './ISettingObject';
import {ISettingStorage} from './ISettingStorage';
import {ISettingObjectErrorListener} from './ISettingObjectErrorListener';
import {ReplaySubject, Subject} from "rxjs";
import {Argument, TypeUtils} from "../utils";

export abstract class DynamicSettingObject<TSettings, TStorageSettings> implements ISettingObject<TSettings> {
    private currentValue: TSettings;
    private readonly internalValueUpdated: Subject<void>;

    protected constructor(storage: ISettingStorage<TStorageSettings>,
                          private readonly errorListener: ISettingObjectErrorListener<TSettings>) {
        Argument.isNotNullOrUndefined(storage, 'storage');
        Argument.isNotNullOrUndefined(errorListener, 'errorListener');

        this.internalValueUpdated = new ReplaySubject<void>(1);

        storage.value.subscribe(storageSettings => {
            this.setValue(storageSettings);
            this.internalValueUpdated.next();
        });
    }

    public get valueUpdated(): Subject<void> {
        return this.internalValueUpdated;
    }

    public get value(): Readonly<TSettings> {
        return this.currentValue;
    }

    protected abstract get objectName(): string;

    protected abstract getFromStorage(storageSettings: TStorageSettings): TSettings;

    protected abstract getDefaults(): TSettings;

    protected isValid(settings: TSettings): boolean {
        return !TypeUtils.isNullOrUndefined(settings);
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
