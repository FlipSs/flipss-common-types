import {ISettingObject, ISettingObjectErrorListener, ISettingStorage} from "./internal";
import {Argument, TypeUtils} from "../utils/internal";
import {Observable} from "../models/internal";

export abstract class DynamicSettingObject<TSettings, TStorageSettings> extends Observable<void> implements ISettingObject<TSettings> {
    private currentValue: TSettings;

    protected constructor(storage: ISettingStorage<TStorageSettings>,
                          private readonly errorListener: ISettingObjectErrorListener<TSettings>) {
        super();

        Argument.isNotNullOrUndefined(storage, 'storage');
        Argument.isNotNullOrUndefined(errorListener, 'errorListener');

        storage.subscribe(storageSettings => {
            this.setValue(storageSettings);
            this.nextValue();
        });
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
