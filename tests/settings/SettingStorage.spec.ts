import {ISettingStorage, SettingStorage} from "../../src/settings/internal";
import {ITestSettings} from "./models/ITestSettings";
import {TestSettingLoader} from "./models/TestSettingLoader";
import {IValueObserver} from "../../src/common/IValueObserver";

describe('SettingStorage', () => {
    const settings: ITestSettings[] = [
        {value: 'first'}
    ];

    let settingStorage: ISettingStorage<ITestSettings>;
    let observer: TestSettingStorageObserver;

    beforeAll(() => {
        settingStorage = new SettingStorage<ITestSettings>(new TestSettingLoader(Array.from(settings)));
        observer = new TestSettingStorageObserver();
        settingStorage.subscribe(observer);
    });

    beforeEach(() => settingStorage.refreshAsync());

    it('Should update value', () => {
        expect(observer.value).toEqual(settings[0]);
    });

    it('Should be undefined', () => {
        expect(observer.value).toBeUndefined();
    });
});

class TestSettingStorageObserver implements IValueObserver<ITestSettings> {
    private _lastValue: ITestSettings;

    public get value(): ITestSettings {
        return this._lastValue;
    }

    public onNext(value: Readonly<ITestSettings>): void {
        this._lastValue = value;
    }
}
