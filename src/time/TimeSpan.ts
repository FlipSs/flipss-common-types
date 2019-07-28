import {Argument} from "../utils";

const millisecondsPerSecond = 1000;
const secondsPerMinute = 60;
const minutesPerHour = 60;
const hoursPerDay = 24;

export class TimeSpan {
    private constructor(private readonly value: number) {
        Argument.isNotNullOrUndefined(this.value, 'value');
    }

    public get milliseconds(): number {
        return this.value;
    }

    public get seconds(): number {
        return this.milliseconds / millisecondsPerSecond;
    }

    public get minutes(): number {
        return this.seconds / secondsPerMinute;
    }

    public get hours(): number {
        return this.minutes / minutesPerHour;
    }

    public get days(): number {
        return this.hours / hoursPerDay;
    }

    public static fromMilliseconds(milliseconds: number): TimeSpan {
        return new TimeSpan(milliseconds);
    }

    public static fromSeconds(seconds: number): TimeSpan {
        return new TimeSpan(getMillisecondsFromSeconds(seconds));
    }

    public static fromMinutes(minutes: number): TimeSpan {
        return new TimeSpan(getMillisecondsFromMinutes(minutes));
    }

    public static fromHours(hours: number): TimeSpan {
        return new TimeSpan(getMillisecondsFromHours(hours));
    }

    public static fromDays(days: number): TimeSpan {
        return new TimeSpan(getMillisecondsFromDays(days));
    }

    public add(other: TimeSpan): TimeSpan {
        Argument.isNotNullOrUndefined(other, 'other');

        return new TimeSpan(this.value + other.value);
    }

    public subtract(other: TimeSpan): TimeSpan {
        Argument.isNotNullOrUndefined(other, 'other');

        return new TimeSpan(this.value - other.value);
    }

    public equals(other: TimeSpan): boolean {
        Argument.isNotNullOrUndefined(other, 'other');

        return this.value === other.value;
    }

    public addToDate(date: Date): Date {
        return new Date(date.getMilliseconds() + this.value);
    }

    public subtractFromDate(date: Date): Date {
        return new Date(date.getMilliseconds() - this.value);
    }
}

function getMillisecondsFromSeconds(seconds: number): number {
    return seconds * millisecondsPerSecond;
}

function getMillisecondsFromMinutes(minutes: number): number {
    return getMillisecondsFromSeconds(minutes) * secondsPerMinute;
}

function getMillisecondsFromHours(hours: number): number {
    return getMillisecondsFromMinutes(hours) * minutesPerHour;
}

function getMillisecondsFromDays(days: number): number {
    return getMillisecondsFromHours(days) * hoursPerDay;
}
