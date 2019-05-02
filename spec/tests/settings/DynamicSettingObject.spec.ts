import {SettingStorage} from "../../../src/settings";
import {TestSettingLoader} from "./models/TestSettingLoader";
import {defaultValue, TestSettingObject} from "./models/TestSettingObject";
import {TestSettingObjectErrorListener} from "./models/TestSettingObjectErrorListener";
import {ITestSettings} from "./models/ITestSettings";

describe('DynamicSettingObject tests', () => {
  const settings: ITestSettings[] = [
    {value: 'first'},
    {value: 'second'},
    {value: 'third'}
  ];

  let settingStorage: SettingStorage<ITestSettings>;
  let settingObjectErrorListener: TestSettingObjectErrorListener;
  let settingObject: TestSettingObject;

  beforeAll(() => {
    settingStorage = new SettingStorage<ITestSettings>(new TestSettingLoader(Array.from(settings)));
    settingObjectErrorListener = new TestSettingObjectErrorListener();
  });

  beforeEach(() => {
    settingObject = new TestSettingObject(settingStorage, settingObjectErrorListener);
  });

  it("Initial value should be undefined", () => {
    expect(settingObject.value).not.toBeDefined();
  });

  describe('Value updating', () => {
    beforeEach(() => settingStorage.refreshAsync());

    for (let i = 0; i < settings.length; i++) {
      it(`Should be equal "${settings[i].value}" and valid`, () => {
        expect(settingObject.value).toEqual(settings[i].value);
        expect(settingObjectErrorListener.called).toBeFalsy();
      });
    }
  });

  describe("Should take the latest value from storage when created after storage refreshed", () => {
    it(`Equals to ${settings[settings.length - 1].value}`, () => {
      expect(settingObject.value).toEqual(settings[settings.length - 1].value);
    });
  });

  describe("On bad value", () => {
    beforeAll(() => settingStorage.refreshAsync());

    it('Should call error listener', () => {
      expect(settingObjectErrorListener.called).toBeTruthy();
    });

    it('Should set default value', () => {
      expect(settingObject.value).toEqual(defaultValue);
    });
  });
});
