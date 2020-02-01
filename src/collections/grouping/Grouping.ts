import {Enumerable, IGrouping} from "../internal";

export class Grouping<TKey, TValue> extends Enumerable<TValue> implements IGrouping<TKey, TValue> {
    public constructor(private readonly _groupKey: TKey, private readonly _items: TValue[]) {
        super();
    }

    public get key(): TKey {
        return this._groupKey;
    }

    protected getValue(): TValue[] {
        return this._items;
    }
}
