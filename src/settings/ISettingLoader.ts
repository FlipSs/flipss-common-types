export interface ISettingLoader<TSettings> {
  loadAsync(): Promise<TSettings>;
}
