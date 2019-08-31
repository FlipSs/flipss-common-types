import {testCache} from "./common";
import {SlidingExpirationCache} from "../../../src/caching/internal";
import {TimeSpan} from "../../../src/time/internal";
import {usingAsync} from "../../../src/common/functions";

describe('SlidingExpirationCache', () => {
    testCache(SlidingExpirationCache);

    it('Should remove value when it not used and expired', async () => {
        await usingAsync(new SlidingExpirationCache<string, number>(() => TimeSpan.fromMilliseconds(300), () => TimeSpan.fromMilliseconds(100)),
            async cache => {
                cache.set('test', 15);
                expect(cache.containsKey('test')).toBeTruthy();

                for (let i = 0; i < 3; i++) {
                    await new Promise(resolve => setTimeout(resolve, 200));

                    expect(cache.containsKey('test')).toBeTruthy();
                    cache.get('test');
                }

                await new Promise(resolve => setTimeout(resolve, 350));

                expect(cache.containsKey('test')).toBeFalsy();
            });
    });

});
