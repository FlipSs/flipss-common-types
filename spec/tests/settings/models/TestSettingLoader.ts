import {ISettingLoader} from "../../../../src/settings";
import {ITestSettings} from "./ITestSettings";

export class TestSettingLoader implements ISettingLoader<ITestSettings> {
  public constructor(private readonly settings: ITestSettings[]) {
  }

  public loadAsync(): Promise<ITestSettings> {
    return Promise.resolve(this.settings && this.settings.length > 0 && this.settings.shift() || undefined);
  }
}
