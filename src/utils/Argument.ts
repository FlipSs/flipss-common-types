export class Argument {
  public static isNotNullOrUndefined(arg: object, parameterName: string): void {
    if (arg == undefined) {
      throw new Error(`${parameterName} can not be null or undefined.`);
    }
  }
}
