import {TypeUtils} from "../utils/internal";
import {ILogInfo, LogMessageContainerError, LogMessageFactory} from "./internal";
import {asEnumerable, Dictionary, IDictionary, ISet, Set} from "../collections/internal";

const customLogInfoDictionary: IDictionary<Object, IDictionary<string, ILogInfo>> = new Dictionary<Object, IDictionary<string, ILogInfo>>();
const disabledLogInfoDictionary: IDictionary<Object, ISet<string>> = new Dictionary<Object, ISet<string>>();

export function LogInfo(info: ILogInfo) {
    return (target: Function) => {
        const prototype = target.prototype;

        const disabledProperties = disabledLogInfoDictionary.getOrDefault(prototype, new Set<string>());
        disabledProperties.tryAdd('constructor');

        const customProperties = customLogInfoDictionary.getOrDefault(prototype, new Dictionary<string, ILogInfo>());

        const availableProperties = asEnumerable(Object.getOwnPropertyNames(prototype))
            .where(p => !disabledProperties.has(p))
            .select(p => {
                return {
                    descriptor: Object.getOwnPropertyDescriptor(prototype, p),
                    name: p
                }
            })
            .where(p => !TypeUtils.isNullOrUndefined(p.descriptor) && TypeUtils.is(p.descriptor.value, Function) && p.descriptor.writable)
            .toArray();

        for (const property of availableProperties) {
            const propertyName = property.name;
            const logInfo: ILogInfo = customProperties.getOrDefault(propertyName, info);

            const propertyValue = property.descriptor.value;
            prototype[propertyName] = function (...args: any[]) {
                try {
                    const result = propertyValue.apply(this, args);
                    if (!TypeUtils.is(result, Promise)) {
                        return result;
                    }

                    return result.then(undefined, (reason) => {
                        if (TypeUtils.is(reason, LogMessageContainerError)) {
                            return Promise.reject(reason);
                        }

                        const logMessage = LogMessageFactory.create(reason, logInfo.category, logInfo.logLevel);

                        return Promise.reject(new LogMessageContainerError(logMessage));
                    });
                } catch (e) {
                    if (TypeUtils.is(e, LogMessageContainerError)) {
                        throw e;
                    }

                    const logMessage = LogMessageFactory.create(e, logInfo.category, logInfo.logLevel);

                    throw new LogMessageContainerError(logMessage);
                }
            }
        }
    }
}

export function LogInfoDisable(): MethodDecorator {
    return (target: Object, propertyName: string, descriptor: PropertyDescriptor) => {
        disabledLogInfoDictionary.getOrAdd(target, target => new Set<string>()).tryAdd(propertyName);
    };
}

export function CustomLogInfo(info: ILogInfo) {
    return (target: Object, propertyName: string, descriptor: PropertyDescriptor) => {
        customLogInfoDictionary.getOrAdd(target, (t) => new Dictionary<string, ILogInfo>()).set(propertyName, info);
    }
}

