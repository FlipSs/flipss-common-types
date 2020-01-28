import {Action, Func} from "../../src/types/internal";
import {createContinuousTimer, createCountdownTimer, ITimer, TimerState, TimeSpan} from "../../src/time/internal";
import Spy = jasmine.Spy;

describe('Timer', () => {
    describe('CountdownTimer', () => {
        testTimer(a => createCountdownTimer(a));

        describe('Specific', () => {
            let timer: ITimer;
            let endSpy: Spy;
            let tickSpy: Spy;

            beforeEach(() => {
                const actionObj = new Test();

                timer = createCountdownTimer(() => actionObj.action(), () => actionObj.onTick());
                endSpy = spyOn(actionObj, 'action');
                tickSpy = spyOn(actionObj, 'onTick');
            });

            afterEach(() => timer.dispose());

            it('Should end when time is up', async () => {
                timer.start(TimeSpan.fromMilliseconds(500));

                await delay(550);

                expect(endSpy).toHaveBeenCalledTimes(1);
                expect(timer.getState()).toEqual(TimerState.stopped);

                endSpy.calls.reset();

                await delay(550);

                expect(endSpy).not.toHaveBeenCalled();
            });

            it('Should call onTick with left time', async () => {
                timer.start(TimeSpan.fromMilliseconds(250));

                await delay(300);

                expect(tickSpy).toHaveBeenCalled()
            });
        });
    });

    describe('ContinuousTimer', () => {
        testTimer(a => createContinuousTimer(a));

        describe('Specific', () => {
            let timer: ITimer;
            let periodSpy: Spy;

            beforeEach(() => {
                const actionObj = new Test();

                timer = createContinuousTimer(() => actionObj.action());
                periodSpy = spyOn(actionObj, 'action');
            });

            afterEach(() => timer.dispose());

            it('Should reset time when time is up', async () => {
                timer.start(TimeSpan.fromMilliseconds(500));

                for (let i = 0; i < 3; i++) {
                    expect(periodSpy).toHaveBeenCalledTimes(i);
                    expect(timer.getState()).toEqual(TimerState.started);

                    await delay(550);
                }
            });
        });
    });
});

function testTimer(timerFactory: Func<ITimer, Action>): void {
    describe('getState', () => {
        let timer: ITimer;

        beforeEach(() => {
            timer = timerFactory(() => {
            });
        });

        afterEach(() => timer.dispose());

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
        let actionSpy: Spy;

        beforeEach(() => {
            const actionObj = new Test();

            timer = timerFactory(() => actionObj.action());
            actionSpy = spyOn(actionObj, 'action');
        });

        afterEach(() => timer.dispose());

        it('Should throw error when timer already started', () => {
            timer.start(TimeSpan.fromDays(1));

            expect(() => timer.start(TimeSpan.fromHours(1))).toThrow();
        });

        it('Should start timer on specified period', async () => {
            timer.start(TimeSpan.fromMilliseconds(500));

            expect(timer.getState()).toEqual(TimerState.started);
            await delay(550);

            expect(actionSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('stop', () => {
        let timer: ITimer;
        let actionSpy: Spy;

        beforeEach(() => {
            const actionObj = new Test();

            timer = timerFactory(() => actionObj.action());
            actionSpy = spyOn(actionObj, 'action');
        });

        afterEach(() => timer.dispose());

        it('Should throw error when period null or undefined', () => {
            expect(() => timer.start(undefined)).toThrow();
            expect(() => timer.start(null)).toThrow();
        });

        it('Should throw error when timer already stopped', () => {
            timer.start(TimeSpan.fromDays(1));

            expect(() => timer.stop()).not.toThrow();
            expect(() => timer.stop()).toThrow();
        });

        it('Should not call action when stopped', async () => {
            timer.start(TimeSpan.fromMilliseconds(500));
            timer.stop();

            await delay(550);

            expect(actionSpy).not.toHaveBeenCalled();
        });
    });

    describe('restart', () => {
        let timer: ITimer;
        let actionSpy: Spy;

        beforeEach(() => {
            const actionObj = new Test();

            timer = timerFactory(() => actionObj.action());
            actionSpy = spyOn(actionObj, 'action');
        });

        afterEach(() => timer.dispose());

        it('Should throw error when period null or undefined', () => {
            expect(() => timer.restart(undefined)).toThrow();
            expect(() => timer.restart(null)).toThrow();
        });

        it('Should not throw error when timer started, suspended or stopped', () => {
            const period = TimeSpan.fromSeconds(10);

            timer.start(period);
            expect(() => timer.restart(period)).not.toThrow();

            timer.stop();
            expect(() => timer.restart(period)).not.toThrow();

            timer.stop();
            timer.start(period);
            timer.suspend();
            expect(() => timer.restart(period)).not.toThrow();
        });

        it('Should stop and start timer again', async () => {
            timer.start(TimeSpan.fromMilliseconds(300));
            timer.restart(TimeSpan.fromMilliseconds(500));

            await delay(400);

            expect(actionSpy).not.toHaveBeenCalled();

            await delay(250);

            expect(actionSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('resetTime', () => {
        let timer: ITimer;
        let actionSpy: Spy;

        beforeEach(() => {
            const actionObj = new Test();

            timer = timerFactory(() => actionObj.action());
            actionSpy = spyOn(actionObj, 'action');
        });

        afterEach(() => timer.dispose());

        it('Should throw error when timer stopped', () => {
            expect(() => timer.resetTime()).toThrow();
        });

        it('Should reset time when timer started', async () => {
            timer.start(TimeSpan.fromMilliseconds(500));

            await delay(250);

            timer.resetTime();

            await delay(300);

            expect(actionSpy).not.toHaveBeenCalled();

            await delay(300);

            expect(actionSpy).toHaveBeenCalledTimes(1);
        });

        it('Should reset time when timer suspended', async () => {
            timer.start(TimeSpan.fromMilliseconds(500));

            await delay(250);

            timer.suspend();
            timer.resetTime();
            timer.resume();

            await delay(300);

            expect(actionSpy).not.toHaveBeenCalled();

            await delay(250);

            expect(actionSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('suspend', () => {
        let timer: ITimer;
        let actionSpy: Spy;

        beforeEach(() => {
            const actionObj = new Test();

            timer = timerFactory(() => actionObj.action());
            actionSpy = spyOn(actionObj, 'action');
        });

        afterEach(() => timer.dispose());

        it('Should throw error when timer stopped', () => {
            expect(() => timer.suspend()).toThrow();
        });

        it('Should throw error when timer suspended', () => {
            timer.start(TimeSpan.fromMilliseconds(10));
            timer.suspend();
            expect(() => timer.suspend()).toThrow();
        });

        it('Should suspend timer', async () => {
            timer.start(TimeSpan.fromMilliseconds(300));

            await delay(250);

            timer.suspend();

            await delay(250);

            expect(actionSpy).not.toHaveBeenCalled();

            timer.resume();

            await delay(250);

            expect(actionSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('resume', () => {
        let timer: ITimer;
        let actionSpy: Spy;

        beforeEach(() => {
            const actionObj = new Test();

            timer = timerFactory(() => actionObj.action());
            actionSpy = spyOn(actionObj, 'action');
        });

        afterEach(() => timer.dispose());

        it('Should throw error when timer not suspended', () => {
            expect(() => timer.resume()).toThrow();

            timer.start(TimeSpan.fromMilliseconds(100));

            expect(() => timer.resume()).toThrow();
        });

        it('Should continue when suspended', async () => {
            timer.start(TimeSpan.fromMilliseconds(500));

            await delay(300);

            timer.suspend();

            await delay(500);

            timer.resume();

            await delay(260);

            expect(actionSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('dispose', () => {
        let timer: ITimer;
        let actionSpy: Spy;

        beforeEach(() => {
            const actionObj = new Test();

            timer = timerFactory(() => actionObj.action());
            actionSpy = spyOn(actionObj, 'action');
        });

        afterEach(() => timer.dispose());

        it('Should stop on dispose', async () => {
            timer.start(TimeSpan.fromMilliseconds(400));

            await delay(300);

            timer.dispose();

            await delay(300);

            expect(actionSpy).not.toHaveBeenCalled();
        });
    });
}

function delay(delay: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, delay);
    })
}

class Test {
    public action(): void {
    }

    public onTick(): void {
    }
}
