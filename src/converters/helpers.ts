import {TypeUtils} from "../utils/internal";
import {asEnumerable, IReadOnlySet} from "../collections/internal";

export function getAvailablePropertyNames(value: any): IReadOnlySet<string> {
    return asEnumerable(Object.getOwnPropertyNames(value)).where(p => {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(value, p);

        return !TypeUtils.isNullOrUndefined(propertyDescriptor) && propertyDescriptor.writable;
    }).toReadOnlySet();
}
