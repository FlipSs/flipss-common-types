import {ISettingLoader, ISettingStorage} from "./internal";
import {Argument} from "../utils/internal";
import {ReplayObservable} from "../common/internal";

export class SettingStorage<TSettings> extends ReplayObservable<TSettings> implements ISettingStorage<TSettings> {
    public constructor(private readonly loader: ISettingLoader<TSettings>) {
        super(1);

        Argument.isNotNullOrUndefined(loader, 'loader');
    }

    public async refreshAsync(): Promise<void> {
        const value = await this.loader.loadAsync();

        this.next(value);
    }
}

