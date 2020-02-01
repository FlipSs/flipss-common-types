import {Enumerable, IGrouping, IReadOnlyCollection} from "../internal";

export class Grouping<TKey, TValue> extends Enumerable<TValue> implements IGrouping<TKey, TValue> {
    public constructor(private readonly _groupKey: TKey, private readonly _values: IReadOnlyCollection<TValue>) {
        super();
    }

    public get key(): TKey {
        return this._groupKey;
    }

    public get values(): IReadOnlyCollection<TValue> {
        return this._values;
    }

    protected getValues(): Iterable<TValue> {
        return this._values;
    }
}
