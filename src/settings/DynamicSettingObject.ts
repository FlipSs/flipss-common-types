import {ISettingObject, ISettingStorage} from "./internal";
import {Argument, TypeUtils} from "../utils/internal";
import {IDisposable, IValueObserver, Observable} from "../models/internal";

export abstract class DynamicSettingObject<TSettings, TStorageSettings> extends Observable<TSettings> implements ISettingObject<TSettings>, IValueObserver<TStorageSettings> {
    private readonly subscription: IDisposable;

    private currentValue: TSettings;

    protected constructor(storage: ISettingStorage<TStorageSettings>) {
        super();

        Argument.isNotNullOrUndefined(storage, 'storage');

        this.subscription = storage.subscribe(this);
    }

    public get value(): Readonly<TSettings> {
        return this.currentValue;
    }

    public onNext(value: Readonly<TStorageSettings>): void {
        const settingFromStorage = this.getFromStorage(value);

        let settings: TSettings;
        if (!this.isValid(settingFromStorage)) {
            this.error(new Error('Settings from storage is not valid.'));

            if (!TypeUtils.isNullOrUndefined(this.currentValue)) {
                return;
            }

            settings = this.getDefaults();
        } else {
            settings = settingFromStorage;
        }

        this.currentValue = settings;
        this.next(settings);
    }

    public dispose(): void {
        super.dispose();

        this.subscription.dispose();
    }

    protected abstract getFromStorage(storageSettings: TStorageSettings): TSettings;

    protected abstract getDefaults(): TSettings;

    protected isValid(settings: TSettings): boolean {
        return !TypeUtils.isNullOrUndefined(settings);
    }
}
