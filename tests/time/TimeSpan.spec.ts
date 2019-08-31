import {TimeSpan} from "../../src/time/internal";

describe('TimeSpan', () => {
    describe('Interaction', () => {
        let timeSpan: TimeSpan;
        let time: number;

        beforeEach(() => {
            time = Math.floor(Math.random() * 1000000);
            timeSpan = TimeSpan.fromMilliseconds(time);
        });

        describe('milliseconds', () => {
            it('Should return correct milliseconds', () => {
                expect(timeSpan.milliseconds).toEqual(time);
            });
        });

        describe('seconds', () => {
            it('Should return correct seconds', () => {
                expect(timeSpan.seconds).toEqual(time / 1000);
            });
        });

        describe('minutes', () => {
            it('Should return correct minutes', () => {
                expect(timeSpan.minutes).toEqual(time / 1000 / 60);
            });
        });

        describe('hours', () => {
            it('Should return correct hours', () => {
                expect(timeSpan.hours).toEqual(time / 1000 / 60 / 60);
            });
        });

        describe('days', () => {
            it('Should return correct days', () => {
                expect(timeSpan.days).toEqual(time / 1000 / 60 / 60 / 24);
            });
        });

        describe('add', () => {
            it('Should add other TimeSpan value', () => {
                expect(timeSpan.add(timeSpan).milliseconds).toEqual(time * 2);
            });
        });

        describe('subtract', () => {
            it('Should subtract other TimeSpan value', () => {
                expect(timeSpan.subtract(timeSpan).milliseconds).toEqual(0);
            });
        });

        describe('equals', () => {
            it('Should return true when equals', () => {
                expect(timeSpan.equals(TimeSpan.fromMilliseconds(time))).toBeTruthy();
            });

            it('Should return false when not equals', () => {
                expect(timeSpan.equals(TimeSpan.fromMilliseconds(time - 100))).toBeFalsy();
            });
        });

        describe('addToDate', () => {
            it('Should add TimeSpan value to date', () => {
                const now = new Date();

                expect(timeSpan.addToDate(now)).toEqual(new Date(now.getTime() + timeSpan.milliseconds));
            });
        });

        describe('subtractFromDate', () => {
            it('Should subtract TimeSpan value from date', () => {
                const now = new Date();

                expect(timeSpan.subtractFromDate(now)).toEqual(new Date(now.getTime() - timeSpan.milliseconds));
            });
        });
    });

    describe('Creation', () => {
        it('Should create correct TimeSpan from milliseconds', () => {
            const timeSpan = TimeSpan.fromMilliseconds(155);

            expect(timeSpan.milliseconds).toEqual(155);
        });

        it('Should create correct TimeSpan from seconds', () => {
            const timeSpan = TimeSpan.fromSeconds(10);

            expect(timeSpan.milliseconds).toEqual(10 * 1000);
        });

        it('Should create correct TimeSpan from minutes', () => {
            const timeSpan = TimeSpan.fromMinutes(5);

            expect(timeSpan.milliseconds).toEqual(5 * 1000 * 60);
        });

        it('Should create correct TimeSpan from hours', () => {
            const timeSpan = TimeSpan.fromHours(3);

            expect(timeSpan.milliseconds).toEqual(3 * 1000 * 60 * 60);
        });

        it('Should create correct TimeSpan from days', () => {
            const timeSpan = TimeSpan.fromDays(2);

            expect(timeSpan.milliseconds).toEqual(2 * 1000 * 60 * 60 * 24);
        });
    });
});
