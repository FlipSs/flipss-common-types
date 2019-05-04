import {TypeUtils} from "../utils";
import {ILogInfo} from "./ILogInfo";
import {LoggableError} from "./LoggableError";
import {LogMessageFactory} from "./LogMessageFactory";

const methodLogInfo = '___method___log___info___';
const methodLogInfoDisable = '___method___log___info___disable___';

export function ClassLogInfo(info: ILogInfo) {
  return (target: Function) => {
    const prototype = target.prototype;
    const excludedProperties = new Set<string>(['constructor', methodLogInfo, methodLogInfoDisable]);
    if (methodLogInfoDisable in prototype) {
      const disabledProperties = prototype[methodLogInfoDisable];
      if (TypeUtils.is(disabledProperties, Array)) {
        for (const property of disabledProperties) {
          if (TypeUtils.isString(property)) {
            excludedProperties.add(property);
          }
        }
      }
    }

    const methodLogInfoMap: Map<string, ILogInfo> = methodLogInfo in prototype &&
        TypeUtils.is(prototype[methodLogInfo], Map) &&
        prototype[methodLogInfo];

    for (const propertyName in prototype) {
      if (!excludedProperties.has(propertyName) && prototype.hasOwnProperty(propertyName)) {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);
        if (!propertyDescriptor ||
            !TypeUtils.is(propertyDescriptor.value, Function) ||
            propertyDescriptor.get && !propertyDescriptor.set) {
          continue;
        }

        const method = propertyDescriptor.value;
        const methodLogInfo: ILogInfo = methodLogInfoMap.get(propertyName) as ILogInfo || info;

        prototype[propertyName] = (...args: any[]) => {
          try {
            const methodResult = method.apply(this, args);
            if (!TypeUtils.isNullOrUndefined(methodResult)) {
              return Promise.resolve(methodResult).then(undefined, (reason) => {
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
}

export function DisableMethodLogInfo() {
  return (target: any, propertyName: string) => {
    if (!target.hasOwnProperty(methodLogInfoDisable)) {
      target[methodLogInfoDisable] = [];
    }

    target[methodLogInfoDisable].push(propertyName);
  }
}

export function MethodLogInfo(info: ILogInfo) {
  return (target: any, propertyName: string) => {
    if (!target.hasOwnProperty(methodLogInfo)) {
      target[methodLogInfo] = new Map<string, ILogInfo>();
    }

    target[methodLogInfo].set(propertyName, info);
  }
}

