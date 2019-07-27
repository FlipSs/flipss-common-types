export interface ISettingObjectErrorListener<TSettings> {
    onNotValidSettings(objectName: string, settings: TSettings);
}
