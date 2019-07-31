import {DynamicSettingObject, ISettingObjectErrorListener, ISettingStorage} from "../../../../src/settings/internal";
import {ITestSettings} from "./ITestSettings";

export const defaultValue = 'default';

export class TestSettingObject extends DynamicSettingObject<string, ITestSettings> {
    public constructor(storage: ISettingStorage<ITestSettings>,
                       errorListener: ISettingObjectErrorListener<string>) {
        super(storage, errorListener);
    }

    protected get objectName(): string {
        return 'TestSettingObject';
    }

    protected getDefaults(): string {
        return defaultValue;
    }

    protected getFromStorage(storageSettings: ITestSettings): string {
        return storageSettings && storageSettings.value;
    }
}
