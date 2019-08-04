import {DisplayProcessor, SpecReporter} from "jasmine-spec-reporter";

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter({
    customProcessors: [DisplayProcessor],
    spec: {
        displayDuration: true
    }
}));
