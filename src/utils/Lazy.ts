import {Func} from "../types";
import {Argument} from ".";

export class Lazy<T> {
  private initialized: boolean;
  private currentValue: T;

  public constructor(private readonly valueFactory: Func<void, T>) {
    Argument.isNotNullOrUndefined(valueFactory, 'ValueFactory');

    this.reset();
  }

  public get value(): T {
    if (!this.initialized) {
      this.currentValue = this.valueFactory();
      this.initialized = true;
    }

    return this.currentValue;
  }

  public reset(): void {
    this.initialized = false;
  }
}
