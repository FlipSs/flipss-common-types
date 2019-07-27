import {ReplaySubject, Subject} from "rxjs";
import {ISettingStorage} from "./ISettingStorage";
import {ISettingLoader} from "./ISettingLoader";
import {Argument} from "../utils";

export class SettingStorage<TSettings> implements ISettingStorage<TSettings> {
    private readonly internalValue: Subject<TSettings>;

    public constructor(private readonly loader: ISettingLoader<TSettings>) {
        Argument.isNotNullOrUndefined(loader, 'loader');

        this.internalValue = new ReplaySubject<TSettings>(1);
    }

    public get value(): Subject<TSettings> {
        return this.internalValue;
    }

    public async refreshAsync(): Promise<void> {
        const loadedValue = await this.loader.loadAsync();

        this.internalValue.next(loadedValue);
    }
}
