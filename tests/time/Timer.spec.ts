import {Func} from "../../src/types/internal";
import {createContinuousTimer, createCountdownTimer, ITimer, TimerState, TimeSpan} from "../../src/time/internal";

describe('Timer', () => {
    describe('CountdownTimer', () => {
        testTimer(() => createCountdownTimer(() => {
        }));
    });

    describe('ContinuousTimer', () => {
        testTimer(() => createContinuousTimer(() => {
        }));
    });
});

function testTimer(timerFactory: Func<ITimer>): void {
    describe('getState', () => {
        let timer: ITimer;

        beforeEach(() => {
            timer = timerFactory();
        });

        it('Should return stopped state when timer stopped', () => {
            expect(timer.getState()).toEqual(TimerState.stopped);
        });

        it('Should return started state when timer started', () => {
            timer.start(TimeSpan.fromDays(10000));

            expect(timer.getState()).toEqual(TimerState.started);
        });

        it('Should return suspended state when timer suspended', () => {
            timer.start(TimeSpan.fromDays(10000));
            timer.suspend();

            expect(timer.getState()).toEqual(TimerState.suspended);
        });
    });

    describe('start', () => {
        let timer: ITimer;

        beforeEach(() => {
            timer = timerFactory();
        });

        it('Should throw error when timer already started', () => {
            timer.start(TimeSpan.fromDays(1));

            expect(() => timer.start(TimeSpan.fromHours(1))).toThrow();
        });

        it('Should start timer on specified period', async () => {
            timer.start(TimeSpan.fromSeconds(1));

            expect(timer.getState()).toEqual(TimerState.started);
            return new Promise(resolve => {
                setTimeout(() => {
                    expect(timer.getState()).toEqual(TimerState.stopped);
                }, 1000);
            });
        });
    });

    describe('stop', () => {

    });

    describe('restart', () => {

    });

    describe('suspend', () => {

    });

    describe('resume', () => {

    });

    describe('dispose', () => {

    });
}
