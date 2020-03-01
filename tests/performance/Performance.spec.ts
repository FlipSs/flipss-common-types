import {IPerformanceMeasureHandler, TrackPerformance} from "../../src/performance/internal";

describe('Performance', () => {
    it('Should create correct measure', async () => {
        const test = new Test();
        const spy = spyOn(handler, 'handle');
        await test.run();

        expect(spy).toHaveBeenCalledTimes(1);
        const measure = spy.calls.first().args[0] as PerformanceMeasure;
        const measureLimit = spy.calls.first().args[1] as number;

        expect(measure).toBeDefined();
        expect(measure.entryType).toBe('measure');
        expect(measure.duration).toBeGreaterThan(measureLimit * 1.99);
        expect(measure.name).toContain('run');
        expect(measure.name).toContain('Test');

        expect(measureLimit).toBe(limit);
    });
});

const limit = 1000;

class TestHandler implements IPerformanceMeasureHandler {
    public handle(measure: PerformanceMeasure, limit?: number): void {
    }
}

const handler = new TestHandler();

class Test {
    @TrackPerformance(limit, handler)
    public run(): Promise<void> {
        return new Promise<void>(r => setTimeout(r, limit * 2));
    }
}
