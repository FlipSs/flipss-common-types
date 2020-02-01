import {ISettingLoader} from "../../../src/settings/internal";
import {ITestSettings} from "./ITestSettings";

export class TestSettingLoader implements ISettingLoader<ITestSettings> {
    public constructor(private readonly _settings: ITestSettings[]) {
    }

    public loadAsync(): Promise<ITestSettings> {
        return Promise.resolve(this._settings && this._settings.length > 0 && this._settings.shift() || undefined);
    }
}
