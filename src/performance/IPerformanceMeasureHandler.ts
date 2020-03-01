export interface IPerformanceMeasureHandler {
    handle(measure: PerformanceMeasure, limit?: number): void;
}
