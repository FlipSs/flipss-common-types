import {ISettingStorage} from "./ISettingStorage";
import {ISettingLoader} from "./ISettingLoader";
import {Argument} from "../utils";
import {ReplayObservable} from "../models";

export class SettingStorage<TSettings> extends ReplayObservable<TSettings> implements ISettingStorage<TSettings> {
    public constructor(private readonly loader: ISettingLoader<TSettings>) {
        super(1);

        Argument.isNotNullOrUndefined(loader, 'loader');
    }

    public async refreshAsync(): Promise<void> {
        const value = await this.loader.loadAsync();

        this.nextValue(value);
    }
}

