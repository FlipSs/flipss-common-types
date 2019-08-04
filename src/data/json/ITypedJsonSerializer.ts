export interface ITypedJsonSerializer<T> {
    serialize(value: T): string;

    deserialize(json: string): T;
}
