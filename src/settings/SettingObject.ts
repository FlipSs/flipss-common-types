import {ISettingObject, ISettingStorage} from "./internal";
import {Argument, TypeUtils} from "../utils/internal";
import {IDisposable, IValueObserver, Observable} from "../common/internal";

export abstract class SettingObject<TSettings, TStorageSettings> extends Observable<TSettings> implements ISettingObject<TSettings>, IValueObserver<TStorageSettings> {
    private readonly _subscription: IDisposable;

    private _currentValue: TSettings;

    protected constructor(storage: ISettingStorage<TStorageSettings>) {
        super();

        Argument.isNotNullOrUndefined(storage, 'storage');

        this._subscription = storage.subscribe(this);
    }

    public get value(): Readonly<TSettings> {
        return this._currentValue;
    }

    public onNext(value: Readonly<TStorageSettings>): void {
        const settingFromStorage = this.getFromStorage(value);

        let settings: TSettings;
        if (!this.isValid(settingFromStorage)) {
            this.error(new Error('Settings from storage is not valid.'));

            if (!TypeUtils.isNullOrUndefined(this._currentValue)) {
                return;
            }

            settings = this.getDefaults();
        } else {
            settings = settingFromStorage;
        }

        this._currentValue = settings;
        this.next(settings);
    }

    public dispose(): void {
        super.dispose();

        this._subscription.dispose();
    }

    protected abstract getFromStorage(storageSettings: TStorageSettings): TSettings;

    protected abstract getDefaults(): TSettings;

    protected isValid(settings: TSettings): boolean {
        return !TypeUtils.isNullOrUndefined(settings);
    }
}
