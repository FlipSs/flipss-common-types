import {createCountdownTimer, ITimer, TimerState, TimeSpan} from "../../time/internal";
import {Dictionary, IDictionary, IKeyValuePair, IReadOnlyCollection} from "../../collections/internal";
import {ICache, IStoredValue} from "../internal";
import {Func} from "../../types/internal";
import {Argument, TypeUtils} from "../../utils/internal";

export class AbsoluteExpirationCache<TKey, TValue> implements ICache<TKey, TValue> {
    private readonly timer: ITimer;
    private readonly values: IDictionary<TKey, IStoredValue<TValue>>;

    public constructor(private readonly expirationPeriodFactory: Func<TimeSpan>,
                       private readonly expirationCheckingPeriodFactory: Func<TimeSpan>,
                       values?: IReadOnlyCollection<IKeyValuePair<TKey, TValue>>) {
        const predefinedValues = values && values.select<IKeyValuePair<TKey, IStoredValue<TValue>>>(kv => {
            return {
                key: kv.key,
                value: {
                    updatedOn: new Date(),
                    value: kv.value
                }
            };
        }).toArray();

        this.values = new Dictionary(predefinedValues);
        this.timer = createCountdownTimer(() => {
            this.removeOldValues();
            this.tryStartTimer();
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

        const storedValue = this.values.getOrAdd(key, key => createStoredValue(valueFactory(key)));

        this.tryStartTimer();

        return this.getValue(storedValue);
    }

    public getValueOrDefault(key: TKey, defaultValue?: TValue): TValue | undefined {
        const storedValue = this.values.getOrDefault(key);
        if (TypeUtils.isNullOrUndefined(storedValue)) {
            return defaultValue;
        }

        return this.getValue(storedValue);
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

    private tryStartTimer(): void {
        if (this.timer.getState() !== TimerState.started) {
            this.timer.start(this.expirationCheckingPeriodFactory());
        }
    }

    private removeOldValues(): void {
        const expiredOn = this.expirationPeriodFactory().subtractFromDate(new Date());

        for (let i = 0; i < this.values.length; i++) {
            const keyValuePair = this.values.getElementAt(i);
            if (keyValuePair.value.updatedOn > expiredOn) {
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
