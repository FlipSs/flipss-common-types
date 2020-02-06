import {createCountdownTimer, ITimer, TimerState, TimeSpan} from "../../time/internal";
import {Dictionary, IDictionary, IEqualityComparer, IKeyValuePair} from "../../collections/internal";
import {ICache, IStoredValue} from "../internal";
import {Func} from "../../types/internal";
import {Argument} from "../../utils/internal";

export class AbsoluteExpirationCache<TKey, TValue> implements ICache<TKey, TValue> {
    private readonly _timer: ITimer;
    private readonly _values: IDictionary<TKey, IStoredValue<TValue>>;

    public constructor(private readonly _expirationPeriodFactory: Func<TimeSpan>,
                       private readonly _expirationCheckingPeriodFactory: Func<TimeSpan>,
                       values?: IKeyValuePair<TKey, TValue>[],
                       equalityComparer?: IEqualityComparer<TKey>) {
        const predefinedValues = values && values.map<IKeyValuePair<TKey, IStoredValue<TValue>>>(kv => {
            return {
                key: kv.key,
                value: createStoredValue(kv.value)
            };
        });

        this._values = new Dictionary<TKey, IStoredValue<TValue>>(predefinedValues, equalityComparer);
        this._timer = createCountdownTimer(() => {
            this.removeOldValues();
            this.startTimer();
        });
    }

    public clear(): void {
        this._values.clear();

        if (this._timer.getState() !== TimerState.stopped) {
            this._timer.stop();
        }
    }

    public containsKey(key: TKey): boolean {
        return this._values.containsKey(key);
    }

    public getOrAdd(key: TKey, valueFactory: Func<TValue, TKey>): TValue {
        Argument.isNotNullOrUndefined(valueFactory, 'valueFactory');

        const storedValue = this._values.getOrAdd(key, k => createStoredValue(valueFactory(k)));

        this.tryStartTimer();

        return this.getValue(storedValue);
    }

    public async getOrAddAsync(key: TKey, asyncValueFactory: Func<Promise<TValue>, TKey>): Promise<TValue> {
        Argument.isNotNullOrUndefined(asyncValueFactory, 'asyncValueFactory');

        const storedValue = await this._values.getOrAddAsync(key,
            async k => createStoredValue(await asyncValueFactory(k))
        );

        this.tryStartTimer();

        return this.getValue(storedValue);
    }

    public get(key: TKey): TValue {
        return this.getInternal(key);
    }

    public getOrDefault(key: TKey, defaultValue?: TValue): TValue | undefined {
        if (this._values.containsKey(key)) {
            return this.getInternal(key);
        }

        return defaultValue;
    }

    public set(key: TKey, value: TValue): void {
        this._values.set(key, createStoredValue(value));

        this.tryStartTimer();
    }

    public dispose(): void {
        this._timer.dispose();
    }

    public tryRemove(key: TKey): boolean {
        return this._values.tryRemove(key);
    }

    protected getValue(storedValue: IStoredValue<TValue>): TValue {
        return storedValue.value;
    }

    private getInternal(key: TKey): TValue {
        return this.getValue(this._values.get(key));
    }

    private tryStartTimer(): void {
        if (this._timer.getState() !== TimerState.started) {
            this.startTimer();
        }
    }

    private startTimer(): void {
        this._timer.start(this._expirationCheckingPeriodFactory());
    }

    private removeOldValues(): void {
        const expiredOn = this._expirationPeriodFactory().subtractFromDate(new Date());

        for (const keyValuePair of this._values.toArray()) {
            if (keyValuePair.value.updatedOn <= expiredOn) {
                this._values.tryRemove(keyValuePair.key);
            }
        }
    }
}

function createStoredValue<T>(value: T): IStoredValue<T> {
    return {
        value: value,
        updatedOn: new Date()
    };
}
