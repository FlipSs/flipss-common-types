import {
    getEqualityComparer,
    IDictionary,
    IEqualityComparer,
    IKeyValuePair,
    ReadOnlyCollection,
    tryRemoveValueFromArray
} from "./internal";
import {Func} from "../types/internal";
import {Argument, TypeUtils} from "../utils/internal";

export class Dictionary<TKey, TValue> extends ReadOnlyCollection<IKeyValuePair<TKey, TValue>> implements IDictionary<TKey, TValue> {
    private readonly _comparer!: IEqualityComparer<TKey>;

    public constructor(values?: Iterable<IKeyValuePair<TKey, TValue>>, comparer?: IEqualityComparer<TKey>) {
        super();

        this._comparer = getEqualityComparer(comparer);
        this._values = [];

        if (!TypeUtils.isNullOrUndefined(values)) {
            for (const item of values) {
                this.set(item.key, item.value);
            }
        }
    }

    private _values!: IKeyValuePair<TKey, TValue>[];

    public get values(): ReadonlyArray<TValue> {
        return this._values.map(i => i.value);
    }

    public get keys(): ReadonlyArray<TKey> {
        return this._values.map(i => i.key);
    }

    public clear(): void {
        this._values = [];
    }

    public containsKey(key: TKey): boolean {
        return this._values.some(i => this.isMatch(i, key));
    }

    public getOrAdd(key: TKey, valueFactory: Func<TValue, TKey>): TValue {
        Argument.isNotNullOrUndefined(valueFactory, 'valueFactory');

        const item = this.find(key);
        if (TypeUtils.isNullOrUndefined(item)) {
            const value = valueFactory(key);

            this.add(key, value);

            return value;
        }

        return item.value;
    }

    public getOrDefault(key: TKey, defaultValue?: TValue): TValue | undefined {
        const item = this.find(key);
        if (TypeUtils.isNullOrUndefined(item)) {
            return defaultValue;
        }

        return item.value;
    }

    public set(key: TKey, value: TValue): void {
        const index = this.findIndex(key);
        if (index < 0) {
            this.add(key, value);
        } else {
            const oldItem = this._values[index];
            this._values[index] = {
                key: oldItem.key,
                value: value
            };
        }
    }

    public tryAdd(key: TKey, value: TValue): boolean {
        const index = this.findIndex(key);
        if (index < 0) {
            this.add(key, value);

            return true;
        }

        return false;
    }

    public tryRemove(key: TKey): boolean {
        return tryRemoveValueFromArray(this._values, i => this.isMatch(i, key));
    }

    public get(key: TKey): TValue {
        const item = this.find(key);
        if (TypeUtils.isNullOrUndefined(item)) {
            throw new Error('Item with specified key does not exists');
        }

        return item.value;
    }

    public getArray(): IKeyValuePair<TKey, TValue>[] {
        return this._values;
    }

    private add(key: TKey, value: TValue): void {
        this._values.push({
            key,
            value
        });
    }

    private find(key: TKey): IKeyValuePair<TKey, TValue> {
        return this._values.find(i => this.isMatch(i, key));
    }

    private findIndex(key: TKey): number {
        return this._values.findIndex(i => this.isMatch(i, key));
    }

    private isMatch(item: IKeyValuePair<TKey, TValue>, key: TKey): boolean {
        return this._comparer.equals(item.key, key);
    }
}
