export interface IJsonSerializer {
    serialize(value: any): string;

    deserialize(json: string): any;
}
