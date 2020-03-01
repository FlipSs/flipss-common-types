import {IPerformanceMeasureHandler} from './IPerformanceMeasureHandler';
import {IEqualityComparer, Set} from "../collections/internal";
import {IDisposable} from "../common/internal";
import {TypeUtils} from "../utils/TypeUtils";

class MethodNameEqualityComparer implements IEqualityComparer<string> {
    public equals(obj1: string, obj2: string): boolean {
        return obj1?.toUpperCase() === obj2?.toUpperCase();
    }
}

class DefaultHandler implements IPerformanceMeasureHandler {
    public handle(measure: PerformanceMeasure, limit?: number): void {
        if (limit && measure.duration < limit) {
            return;
        }

        console.warn(`[Performance] ${measure.name} took ${Math.round(measure.duration)}ms`);
    }
}

class TrackReference implements IDisposable {
    private readonly _name!: string;

    public constructor(
        category: string,
        propertyName: string,
        private readonly _handler: IPerformanceMeasureHandler,
        private readonly _limit?: number
    ) {
        this._name = `${category}-${propertyName}`;

        performance.mark(this._name);
    }

    public dispose(): void {
        performance.measure(this._name, this._name);

        const measure: PerformanceMeasure = performance.getEntriesByName(this._name, 'measure')[0];
        performance.clearMarks(this._name);
        performance.clearMeasures(this._name);

        this._handler.handle(measure, this._limit);
    }
}


const disabledMethodNames = new Set<string>(['constructor'], new MethodNameEqualityComparer());

export function TrackPerformance(limit?: number, handler?: IPerformanceMeasureHandler): MethodDecorator {
    return (target: object, methodName: string, descriptor: PropertyDescriptor) => {
        const targetName = target?.constructor?.name;
        if (disabledMethodNames.has(methodName) || !descriptor.writable) {
            throw new Error(`Unsupported method ${methodName} in ${targetName}`);
        }

        const value = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const reference = new TrackReference(targetName, methodName, handler || new DefaultHandler(), limit);

            let result;
            try {
                result = value.apply(this, args);
            } catch (e) {
                reference.dispose();

                throw e;
            }

            if (!TypeUtils.is(result, Promise)) {
                reference.dispose();

                return result;
            }

            return result.finally(() => reference.dispose());
        };
    };
}
