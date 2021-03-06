import {ISettingStorage, SettingObject, SettingStorage} from "../../src/settings/internal";
import {TestSettingLoader} from "./models/TestSettingLoader";
import {ITestSettings} from "./models/ITestSettings";
import {IErrorObserver} from "../../src/common/IErrorObserver";

const defaultValue = 'default';

describe('SettingObject', () => {
    const settings: ITestSettings[] = [
        {value: 'first'},
        {value: 'second'},
        {value: 'third'}
    ];

    let settingStorage: SettingStorage<ITestSettings>;
    let errorObserver: TestSettingObjectErrorObserver;
    let settingObject: TestSettingObject;

    beforeAll(() => {
        settingStorage = new SettingStorage<ITestSettings>(new TestSettingLoader(Array.from(settings)));
        errorObserver = new TestSettingObjectErrorObserver();
    });

    beforeEach(() => {
        settingObject = new TestSettingObject(settingStorage);
        settingObject.subscribe(errorObserver);
    });

    it("Initial value should be undefined", () => {
        expect(settingObject.value).toBeUndefined();
    });

    describe('Should update value', () => {
        beforeEach(() => settingStorage.refreshAsync());

        for (let i = 0; i < settings.length; i++) {
            it(`Should be equal "${settings[i].value}" and valid`, () => {
                expect(settingObject.value).toEqual(settings[i].value);
                expect(errorObserver.called).toBeFalsy();
            });
        }
    });

    describe("Should take the latest value from storage when created after storage refreshed", () => {
        it(`Equals to ${settings[settings.length - 1].value}`, () => {
            expect(settingObject.value).toEqual(settings[settings.length - 1].value);
        });
    });

    describe("Bad values", () => {
        beforeAll(() => settingStorage.refreshAsync());

        it('Should notify about errors', () => {
            expect(errorObserver.called).toBeTruthy();
        });

        it('Should set default value', () => {
            expect(settingObject.value).toEqual(defaultValue);
        });
    });
});

class TestSettingObject extends SettingObject<string, ITestSettings> {
    public constructor(storage: ISettingStorage<ITestSettings>) {
        super(storage);
    }

    protected getDefaults(): string {
        return defaultValue;
    }

    protected getFromStorage(storageSettings: ITestSettings): string {
        return storageSettings && storageSettings.value;
    }
}

class TestSettingObjectErrorObserver implements IErrorObserver {
    private _isCalled = false;

    public get called(): boolean {
        return this._isCalled;
    }

    public onError(error: Readonly<Error>): void {
        this._isCalled = true;
    }
}
