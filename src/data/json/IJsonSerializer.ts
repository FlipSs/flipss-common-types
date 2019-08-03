export interface IJsonSerializer<T> {
    serialize(value: T): string;

    deserialize(json: string): T;
}
