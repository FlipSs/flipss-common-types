import {createCountdownTimer, ITimer, TimerState, TimeSpan} from "../../time/internal";
import {Dictionary, IDictionary, IEqualityComparer, IKeyValuePair} from "../../collections/internal";
import {ICache, IStoredValue} from "../internal";
import {Func} from "../../types/internal";
import {Argument} from "../../utils/internal";

export class AbsoluteExpirationCache<TKey, TValue> implements ICache<TKey, TValue> {
    private readonly timer: ITimer;
    private readonly values: IDictionary<TKey, IStoredValue<TValue>>;

    public constructor(private readonly expirationPeriodFactory: Func<TimeSpan>,
                       private readonly expirationCheckingPeriodFactory: Func<TimeSpan>,
                       values?: IKeyValuePair<TKey, TValue>[],
                       equalityComparer?: IEqualityComparer<TKey>) {
        const predefinedValues = values && values.map<IKeyValuePair<TKey, IStoredValue<TValue>>>(kv => {
            return {
                key: kv.key,
                value: createStoredValue(kv.value)
            };
        });

        this.values = new Dictionary<TKey, IStoredValue<TValue>>(predefinedValues, equalityComparer);
        this.timer = createCountdownTimer(() => {
            this.removeOldValues();
            this.startTimer();
        });
    }

    public clear(): void {
        this.values.clear();

        if (this.timer.getState() !== TimerState.stopped) {
            this.timer.stop();
        }
    }

    public containsKey(key: TKey): boolean {
        return this.values.containsKey(key);
    }

    public getOrAdd(key: TKey, valueFactory: Func<TValue, TKey>): TValue {
        Argument.isNotNullOrUndefined(valueFactory, 'valueFactory');

        const storedValue = this.values.getOrAdd(key, k => createStoredValue(valueFactory(k)));

        this.tryStartTimer();

        return this.getValue(storedValue);
    }

    public get(key: TKey): TValue {
        return this.getInternal(key);
    }

    public getOrDefault(key: TKey, defaultValue?: TValue): TValue | undefined {
        if (this.values.containsKey(key)) {
            return this.getInternal(key);
        }

        return defaultValue;
    }

    public set(key: TKey, value: TValue): void {
        this.values.set(key, createStoredValue(value));

        this.tryStartTimer();
    }

    public dispose(): void {
        this.timer.dispose();
    }

    protected getValue(storedValue: IStoredValue<TValue>): TValue {
        return storedValue.value;
    }

    private getInternal(key: TKey): TValue {
        return this.getValue(this.values.get(key));
    }

    private tryStartTimer(): void {
        if (this.timer.getState() !== TimerState.started) {
            this.startTimer();
        }
    }

    private startTimer(): void {
        this.timer.start(this.expirationCheckingPeriodFactory());
    }

    private removeOldValues(): void {
        const expiredOn = this.expirationPeriodFactory().subtractFromDate(new Date());

        for (let i = 0; i < this.values.length; i++) {
            const keyValuePair = this.values.getElementAt(i);

            if (keyValuePair.value.updatedOn <= expiredOn) {
                this.values.tryRemove(keyValuePair.key);
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
