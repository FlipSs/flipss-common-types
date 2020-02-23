import {Action, Func, Predicate} from "../types/internal";
import {Argument, TypeUtils} from "../utils/internal";
import {
    AscendingSortItemComparer,
    DescendingSortItemComparer,
    Dictionary,
    getEqualityComparer,
    Grouping,
    IComparer,
    IDictionary,
    IEnumerable,
    IEqualityComparer,
    IGrouping,
    IList,
    IOrderedEnumerable,
    IReadOnlyDictionary,
    IReadOnlyList,
    IReadOnlySet,
    isArray,
    isArrayOrCollection,
    isCollection,
    ISet,
    IterableAsEnumerable,
    List,
    OrderedEnumerable,
    Set,
    toArray
} from "./internal";

export function asEnumerable<T>(items: Iterable<T>): IEnumerable<T> {
    Argument.isNotNullOrUndefined(items, 'items');

    return new IterableAsEnumerable(items);
}

export function funcAsEnumerable<T>(iteratorProvider: Func<Iterator<T>>): IEnumerable<T> {
    Argument.isNotNullOrUndefined(iteratorProvider, 'iteratorProvider');

    return new IterableAsEnumerable(new IteratorProviderWrapper(iteratorProvider));
}

export abstract class Enumerable<T> implements IEnumerable<T> {
    public all(predicate: Predicate<T>): boolean {
        Argument.isNotNullOrUndefined(predicate, 'predicate');

        for (const value of this.getValues()) {
            if (!predicate(value)) {
                return false;
            }
        }

        return true;
    }

    public any(predicate?: Predicate<T>): boolean {
        if (TypeUtils.isNullOrUndefined(predicate)) {
            const values = this.getValues();
            if (isArrayOrCollection(values)) {
                return values.length > 0;
            }

            return !values[Symbol.iterator]()
                .next()
                .done;
        }

        for (const value of this.getValues()) {
            if (predicate(value)) {
                return true;
            }
        }

        return false;
    }

    public append(value: T): IEnumerable<T> {
        return create(() => append(this.getValues(), value));
    }

    public concat(other: Iterable<T>): IEnumerable<T> {
        Argument.isNotNullOrUndefined(other, 'other');

        return create(() => concat(this.getValues(), other));
    }

    public contains(value: T, comparer?: IEqualityComparer<T>): boolean {
        const equalityComparer = getEqualityComparer(comparer);
        for (const sourceValue of this.getValues()) {
            if (equalityComparer.equals(sourceValue, value)) {
                return true;
            }
        }

        return false;
    }

    public count(predicate?: Predicate<T>): number {
        const values = this.getValues();
        let result = 0;
        if (TypeUtils.isNullOrUndefined(predicate)) {
            if (isArrayOrCollection(values)) {
                result = values.length;
            } else {
                const iterator = values[Symbol.iterator]();
                while (!iterator.next().done) {
                    result++;
                }
            }
        } else {
            for (const value of this.getValues()) {
                if (predicate(value)) {
                    result++;
                }
            }
        }

        return result;
    }

    public getElementAt(index: number): T {
        const values = this.getValues();
        if (isArray(values)) {
            return getElementOrDefaultFromArray(values, index, outOfRangeError);
        }

        if (isCollection(values)) {
            getElementOrDefaultFromArray(values.getArray(), index, outOfRangeError);
        }

        return getElementAtOrDefault(values, index, outOfRangeError);
    }

    public getElementAtOrDefault(index: number, defaultValue?: T): T | undefined {
        const values = this.getValues();
        if (isArray(values)) {
            return getElementOrDefaultFromArray(values, index, () => defaultValue);
        }

        if (isCollection(values)) {
            return getElementOrDefaultFromArray(values.getArray(), index, () => defaultValue);
        }

        return getElementAtOrDefault(values, index, () => defaultValue);
    }

    public except(other: Iterable<T>, comparer?: IEqualityComparer<T>): IEnumerable<T> {
        Argument.isNotNullOrUndefined(other, 'other');

        return create(() => except(this.getValues(), other, getEqualityComparer(comparer)));
    }

    public getFirst(predicate?: Predicate<T>): T {
        return getFirstOrDefault(this.getValues(), () => {
            throw new Error('Value not found');
        }, predicate);
    }

    public getFirstOrDefault(predicate?: Predicate<T>, defaultValue?: T): T | undefined {
        return getFirstOrDefault(this.getValues(), () => defaultValue, predicate);
    }

    public groupBy<TKey>(keySelector: Func<TKey, T>, comparer?: IEqualityComparer<TKey>): IEnumerable<IGrouping<TKey, T>> {
        Argument.isNotNullOrUndefined(keySelector, 'keySelector');

        return create(() => groupBy(this.getValues(), keySelector, getEqualityComparer(comparer)));
    }

    public getLast(predicate?: Predicate<T>): T {
        return getLastOrDefault(this.getValues(), () => {
            throw new Error('Item not found');
        }, predicate);
    }

    public getLastOrDefault(predicate?: Predicate<T>, defaultValue?: T): T | undefined {
        return getLastOrDefault(this.getValues(), () => defaultValue, predicate);
    }

    public orderBy<TKey>(keySelector: Func<TKey, T>, comparer?: IComparer<TKey>): IOrderedEnumerable<T> {
        Argument.isNotNullOrUndefined(keySelector, 'keySelector');

        const sortItemSelector = new AscendingSortItemComparer(keySelector, comparer);

        return new OrderedEnumerable(this.getValues(), sortItemSelector);
    }

    public orderByDescending<TKey>(keySelector: Func<TKey, T>, comparer?: IComparer<TKey>): IOrderedEnumerable<T> {
        Argument.isNotNullOrUndefined(keySelector, 'keySelector');

        const sortItemSelector = new DescendingSortItemComparer(keySelector, comparer);

        return new OrderedEnumerable(this.getValues(), sortItemSelector);
    }

    public prepend(value: T): IEnumerable<T> {
        return create(() => prepend(this.getValues(), value));
    }

    public select<TResult>(selector: Func<TResult, T, number>): IEnumerable<TResult> {
        Argument.isNotNullOrUndefined(selector, 'selector');

        return create(() => select(this.getValues(), selector));
    }

    public selectMany<TResult>(selector: Func<Iterable<TResult>, T>): IEnumerable<TResult> {
        Argument.isNotNullOrUndefined(selector, 'selector');

        return create(() => selectMany(this.getValues(), selector));
    }

    public where(predicate: Predicate<T>): IEnumerable<T> {
        Argument.isNotNullOrUndefined(predicate, 'predicate');

        return create(() => where(this.getValues(), predicate));
    }

    public toArray(): T[] {
        return Array.from(this.getValues());
    }

    public forEach(action: Action<T, number>): void {
        Argument.isNotNullOrUndefined(action, 'action');

        let index = 0;
        for (const value of this.getValues()) {
            action(value, index++);
        }
    }

    public [Symbol.iterator](): Iterator<T> {
        return this.getValues()[Symbol.iterator]();
    }

    public reverse(): IEnumerable<T> {
        return create(() => reverse(this.getValues()));
    }

    public toList(): IList<T> {
        return new List(this.getValues());
    }

    public toReadOnlyList(): IReadOnlyList<T> {
        return this.toList();
    }

    public toSet(comparer?: IEqualityComparer<T>): ISet<T> {
        return new Set(this.getValues(), comparer);
    }

    public toReadOnlySet(comparer?: IEqualityComparer<T>): IReadOnlySet<T> {
        return this.toSet(comparer);
    }

    public toDictionary<TKey, TValue>(keySelector: Func<TKey, T>, valueSelector: Func<TValue, T>, comparer?: IEqualityComparer<TKey>): IDictionary<TKey, TValue> {
        Argument.isNotNullOrUndefined(keySelector, 'keySelector');
        Argument.isNotNullOrUndefined(valueSelector, 'valueSelector');

        return new Dictionary(select(this.getValues(), v => {
            return {
                key: keySelector(v),
                value: valueSelector(v)
            };
        }), comparer);
    }

    public toReadOnlyDictionary<TKey, TValue>(keySelector: Func<TKey, T>, valueSelector: Func<TValue, T>, comparer?: IEqualityComparer<TKey>): IReadOnlyDictionary<TKey, TValue> {
        return this.toDictionary(keySelector, valueSelector, comparer);
    }

    public skip(count: number): IEnumerable<T> {
        return create(() => {
            ensureCountIsValid(count);

            return skip(this.getValues(), count);
        });
    }

    public take(count: number): IEnumerable<T> {
        return create(() => {
            ensureCountIsValid(count);

            return take(this.getValues(), count);
        });
    }

    public average(valueProvider: Func<number, T>): number {
        Argument.isNotNullOrUndefined(valueProvider, 'valueProvider');

        let count = 0;
        let total = 0;
        for (const value of this.getValues()) {
            count++;
            total += valueProvider(value);
        }

        if (count === 0) {
            throw new Error('Collection is empty');
        }

        return total / count;
    }

    public min(valueProvider: Func<number, T>): number {
        Argument.isNotNullOrUndefined(valueProvider, 'valueProvider');

        return findBestMatchingValue(this.getValues(), valueProvider, (n, o) => n < o);
    }

    public sum(valueProvider: Func<number, T>): number {
        Argument.isNotNullOrUndefined(valueProvider, 'valueProvider');

        const iterator = this.getValues()[Symbol.iterator]();
        let iterationResult = iterator.next();
        if (iterationResult.done) {
            throw new Error('Collection is empty');
        }

        let sum = valueProvider(iterationResult.value);
        iterationResult = iterator.next();
        while (!iterationResult.done) {
            sum += valueProvider(iterationResult.value);
            iterationResult = iterator.next();
        }

        return sum;
    }

    public max(valueProvider: Func<number, T>): number {
        Argument.isNotNullOrUndefined(valueProvider, 'valueProvider');

        return findBestMatchingValue(this.getValues(), valueProvider, (n, o) => n > o);
    }

    public distinct(comparer?: IEqualityComparer<T>): IEnumerable<T> {
        return create(() => distinct(this.getValues(), getEqualityComparer(comparer)));
    }

    public randomOrDefault(defaultValue?: T): T {
        return this.shuffle().getFirstOrDefault(null, defaultValue);
    }

    public shuffle(): IEnumerable<T> {
        return create(() => shuffle(toArray(this.getValues())));
    }

    public defaultIfEmpty(defaultValue: T): IEnumerable<T> {
        return create(() => defaultIfEmpty(this.getValues(), defaultValue));
    }

    protected abstract getValues(): Iterable<T>;
}

function* append<T>(values: Iterable<T>, valueToAppend: T): IterableIterator<T> {
    for (const value of values) {
        yield value;
    }

    yield valueToAppend;
}

function* concat<T>(values: Iterable<T>, otherValues: Iterable<T>): IterableIterator<T> {
    for (const value of values) {
        yield value;
    }

    for (const value of otherValues) {
        yield value;
    }
}

function getElementAtOrDefault<T>(values: Iterable<T>, index: number, defaultValueProvider: Func<T>): T {
    let currentIndex = 0;
    const iterator = values[Symbol.iterator]();
    let iteratorResult = iterator.next();
    while (!iteratorResult.done) {
        if (currentIndex === index) {
            return iteratorResult.value;
        }

        currentIndex++;
        iteratorResult = iterator.next();
    }

    return defaultValueProvider();
}

function* except<T>(values: Iterable<T>, otherValues: Iterable<T>, comparer: IEqualityComparer<T>): IterableIterator<T> {
    const otherItemSet = new Set(otherValues, comparer);
    for (const value of values) {
        if (!otherItemSet.has(value)) {
            yield value;
        }
    }
}

function getFirstOrDefault<T>(values: Iterable<T>, defaultValueProvider: Func<T>, predicate?: Predicate<T>): T {
    if (TypeUtils.isNullOrUndefined(predicate)) {
        const iterator = values[Symbol.iterator]();
        const iterationResult = iterator.next();

        if (!iterationResult.done) {
            return iterationResult.value;
        }
    } else {
        for (const value of values) {
            if (predicate(value)) {
                return value;
            }
        }
    }

    return defaultValueProvider();
}

function* groupBy<T, TKey>(values: Iterable<T>, keySelector: Func<TKey, T>, comparer: IEqualityComparer<TKey>): IterableIterator<IGrouping<TKey, T>> {
    const groupings = new Dictionary<TKey, IList<T>>(null, comparer);
    for (const value of values) {
        const key = keySelector(value);

        groupings.getOrAdd(key, () => new List<T>()).add(value);
    }

    for (const keyValue of groupings) {
        yield new Grouping(keyValue.key, keyValue.value);
    }
}

function getLastOrDefault<T>(values: Iterable<T>, defaultValueProvider: Func<T>, predicate?: Predicate<T>): T {
    if (TypeUtils.isNullOrUndefined(predicate)) {
        const iterationResult = reverse(values)[Symbol.iterator]().next();
        if (!iterationResult.done) {
            return iterationResult.value;
        }
    } else {
        for (const value of reverse(values)) {
            if (predicate(value)) {
                return value;
            }
        }
    }

    return defaultValueProvider();
}

function* prepend<T>(values: Iterable<T>, valueToPrepend: T): IterableIterator<T> {
    yield valueToPrepend;

    for (const value of values) {
        yield value;
    }
}

function* select<T, TResult>(values: Iterable<T>, selector: Func<TResult, T, number>): IterableIterator<TResult> {
    let index = 0;
    for (const value of values) {
        yield selector(value, index++);
    }
}

function* selectMany<T, TResult>(values: Iterable<T>, selector: Func<Iterable<TResult>, T>): IterableIterator<TResult> {
    for (const value of values) {
        for (const selectedValue of selector(value)) {
            yield selectedValue;
        }
    }
}

function* where<T>(values: Iterable<T>, predicate: Predicate<T>): IterableIterator<T> {
    for (const value of values) {
        if (predicate(value)) {
            yield value;
        }
    }
}

function* skip<T>(values: Iterable<T>, count: number): IterableIterator<T> {
    for (const value of values) {
        if (count === 0) {
            yield value;
        } else {
            count--;
        }
    }
}

function* take<T>(values: Iterable<T>, count: number): IterableIterator<T> {
    for (const value of values) {
        if (count > 0) {
            yield value;

            count--;
        }
    }
}

function findBestMatchingValue<T, TValue>(values: Iterable<T>, valueProvider: Func<TValue, T>, predicate: Predicate<TValue, TValue>): TValue {
    const iterator = values[Symbol.iterator]();
    let iterationResult = iterator.next();
    if (iterationResult.done) {
        throw new Error('Collection is empty');
    }

    let result = valueProvider(iterationResult.value);
    iterationResult = iterator.next();
    while (!iterationResult.done) {
        const preparedValue = valueProvider(iterationResult.value);
        if (predicate(preparedValue, result)) {
            result = preparedValue;
        }

        iterationResult = iterator.next();
    }

    return result;
}

function* reverse<T>(values: Iterable<T>): IterableIterator<T> {
    let array: Array<T>;
    if (isArray(values)) {
        array = values;
    } else if (isCollection(values)) {
        array = values.getArray();
    } else {
        array = Array.from(values);
    }

    for (let i = array.length - 1; i >= 0; i--) {
        yield array[i];
    }
}

function* distinct<T>(values: Iterable<T>, comparer: IEqualityComparer<T>): IterableIterator<T> {
    const set = new Set(null, comparer);
    for (const value of values) {
        if (set.tryAdd(value)) {
            yield value;
        }
    }
}

function* defaultIfEmpty<T>(values: Iterable<T>, defaultValue: T): IterableIterator<T> {
    const iterator = values[Symbol.iterator]();
    let iterationResult = iterator.next();
    if (iterationResult.done) {
        yield defaultValue;
    } else {
        do {
            yield iterationResult.value;

            iterationResult = iterator.next();
        } while (!iterationResult.done);
    }
}

function outOfRangeError(): never {
    throw new RangeError('Index out of range');
}

function getElementOrDefaultFromArray<T>(values: T[], index: number, defaultValueProvider: Func<T>): T {
    if (index >= 0 && index < values.length) {
        return values[index];
    }

    return defaultValueProvider();
}

function ensureCountIsValid(count: number): void {
    if (count < 0) {
        throw  new RangeError('Count must be >= 0');
    }
}

function* shuffle<T>(values: T[]): IterableIterator<T> {
    const indices = [];
    for (let i = 0; i < values.length; i++) {
        indices.push(i);
    }
    let currentIndex = indices.length;
    while (currentIndex > 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        const temp = indices[currentIndex];
        indices[currentIndex] = indices[randomIndex];
        indices[randomIndex] = temp;
    }

    for (const index of indices) {
        yield values[index];
    }
}

function create<T>(func: Func<Iterator<T>>): IEnumerable<T> {
    return new IterableAsEnumerable(new IteratorProviderWrapper(func));
}

class IteratorProviderWrapper<T> implements Iterable<T> {
    public constructor(private readonly _iteratorProvider: Func<Iterator<T>>) {
    }

    public [Symbol.iterator](): Iterator<T> {
        return this._iteratorProvider();
    }
}
