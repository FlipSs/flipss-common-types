import {TypeUtils} from "../utils/internal";
import {ILogInfo, LoggableError, LogMessageFactory} from "./internal";
import {asEnumerable, Dictionary, HashSet, IDictionary, IHashSet} from "../collections/internal";

const customLogInfoDictionary: IDictionary<any, IDictionary<string, ILogInfo>> = new Dictionary<any, IDictionary<string, ILogInfo>>();
const disabledLogInfoDictionary: IDictionary<any, IHashSet<string>> = new Dictionary<any, IHashSet<string>>();

export function ClassLogInfo(info: ILogInfo) {
    return (target: Function) => {
        const prototype = target.prototype;

        const excludedMethods = disabledLogInfoDictionary.getOrDefault(prototype) || new HashSet<string>();
        excludedMethods.add('constructor');

        const customValues = customLogInfoDictionary.getOrDefault(prototype);

        const methods = asEnumerable(Object.getOwnPropertyNames(prototype))
            .where(p => !excludedMethods.has(p))
            .select(p => {
                return {
                    descriptor: Object.getOwnPropertyDescriptor(prototype, p),
                    name: p
                }
            })
            .where(p => !TypeUtils.isNullOrUndefined(p.descriptor) && TypeUtils.is(p.descriptor.value, Function) && p.descriptor.writable)
            .toArray();

        for (const method of methods) {
            const methodValue = method.descriptor.value;
            const methodLogInfo: ILogInfo = customValues && customValues.getOrDefault(method.name) || info;

            prototype[method.name] = (...args: any[]) => {
                try {
                    const result = methodValue.apply(this, args);
                    if (!TypeUtils.isNullOrUndefined(result)) {
                        return Promise.resolve(result).then(undefined, (reason) => {
                            if (TypeUtils.is(reason, LoggableError)) {
                                return Promise.reject(reason);
                            }

                            const logMessage = LogMessageFactory.create(reason, methodLogInfo.category, methodLogInfo.logLevel);
                            return Promise.reject(new LoggableError(logMessage));
                        });
                    }
                } catch (e) {
                    if (TypeUtils.is(e, LoggableError)) {
                        throw e;
                    }

                    const logMessage = LogMessageFactory.create(e, methodLogInfo.category, methodLogInfo.logLevel);

                    throw new LoggableError(logMessage);
                }
            }
        }
    }
}

export function DisableMethodLogInfo() {
    return (target: any, propertyName: string) => {
        disabledLogInfoDictionary
            .getOrAdd(target, (target) => new HashSet<string>())
            .add(propertyName);
    }
}

export function MethodLogInfo(info: ILogInfo) {
    return (target: any, propertyName: string) => {
        customLogInfoDictionary
            .getOrAdd(target, (t) => new Dictionary<string, ILogInfo>())
            .set(propertyName, info);
    }
}

