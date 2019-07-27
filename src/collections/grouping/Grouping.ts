import {Enumerable} from "../Enumerable";
import {IGrouping} from "./IGrouping";

export class Grouping<TKey, TValue> extends Enumerable<TValue> implements IGrouping<TKey, TValue> {
    public constructor(private readonly groupKey: TKey, private readonly items: TValue[]) {
        super();
    }

    public get key(): TKey {
        return this.groupKey;
    }

    protected getValue(): TValue[] {
        return this.items;
    }
}
