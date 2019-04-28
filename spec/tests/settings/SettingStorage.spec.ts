import {ISettingStorage, SettingStorage} from "../../../src/settings";
import {ITestSettings} from "./models/ITestSettings";
import {TestSettingLoader} from "./models/TestSettingLoader";

describe('SettingStorage tests', () => {
  const settings: ITestSettings[] = [
    {value: 'first'}
  ];

  let settingStorage: ISettingStorage<ITestSettings>;
  let value: ITestSettings;

  beforeAll(() => {
    settingStorage = new SettingStorage<ITestSettings>(new TestSettingLoader(Array.from(settings)));
    settingStorage.value.subscribe(v => value = v);
  });

  beforeEach(() => settingStorage.refreshAsync());

  it('Must update value', () => {
    expect(value).toEqual(settings[0]);
  });

  it('Must be undefined', () => {
    expect(value).toBeFalsy();
  });
});