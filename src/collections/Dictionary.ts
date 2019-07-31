import {Collection, IDictionary, IKeyValuePair, IReadOnlyCollection, ReadOnlyCollection} from "./internal";
import {Func} from "../types/internal";
import {Argument} from "../utils/internal";

export class Dictionary<TKey, TValue> extends ReadOnlyCollection<IKeyValuePair<TKey, TValue>> implements IDictionary<TKey, TValue> {
    private readonly map: Map<TKey, TValue>;

    public constructor(items?: IKeyValuePair<TKey, TValue>[]) {
        super();

        this.map = new Map<TKey, TValue>(items && items.map(i => [i && i.key, i && i.value]));
    }

    public get length(): number {
        return this.map.size;
    }

    public get keys(): IReadOnlyCollection<TKey> {
        return new Collection(Array.from(this.map.keys()));
    }

    public get values(): IReadOnlyCollection<TValue> {
        return new Collection(Array.from(this.map.values()));
    }

    public clear(): void {
        this.map.clear();
    }

    public containsKey(key: TKey): boolean {
        return this.map.has(key);
    }

    public getOrAdd(key: TKey, valueFactory: Func<TValue, TKey>): TValue {
        Argument.isNotNullOrUndefined(valueFactory, 'valueFactory');

        if (!this.containsKey(key)) {
            const value = valueFactory(key);

            this.set(key, value);

            return value;
        }

        return this.map.get(key);
    }

    public getValueOrDefault(key: TKey, defaultValue?: TValue): TValue | undefined {
        if (!this.containsKey(key)) {
            return defaultValue;
        }

        return this.map.get(key);
    }

    public set(key: TKey, value: TValue): void {
        this.map.set(key, value);
    }

    public tryAdd(key: TKey, value: TValue): boolean {
        if (!this.containsKey(key)) {
            this.set(key, value);

            return true;
        }

        return false;
    }

    public tryRemove(key: TKey): boolean {
        return this.map.delete(key);
    }

    protected getValue(): IKeyValuePair<TKey, TValue>[] {
        const result: IKeyValuePair<TKey, TValue>[] = [];

        this.map.forEach((v, k) => {
            result.push({
                key: k,
                value: v
            });
        });

        return result;
    }
}
