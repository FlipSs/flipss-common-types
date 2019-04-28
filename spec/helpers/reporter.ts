import {DisplayProcessor, SpecReporter} from "jasmine-spec-reporter";
import SuiteInfo = jasmine.SuiteInfo;

class JasmineDisplayProcessor extends DisplayProcessor {
  public displayJasmineStarted(info: SuiteInfo, log: string): string {
    return `Total specs found: ${info.totalSpecsDefined}\n${log}`;
  }
}

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter({
  customProcessors: [JasmineDisplayProcessor]
}));
