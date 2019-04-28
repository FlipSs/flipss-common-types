import {ISettingObjectErrorListener} from "../../../../src/settings";

export class TestSettingObjectErrorListener implements ISettingObjectErrorListener<string> {
  private isCalled: boolean;

  public get called(): boolean {
    return this.isCalled;
  }

  public onNotValidSettings(objectName: string, settings: string) {
    this.isCalled = true;
  }
}
