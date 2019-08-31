import {testCache} from "./common";
import {AbsoluteExpirationCache} from "../../../src/caching/internal";
import {TimeSpan} from "../../../src/time/internal";
import {usingAsync} from "../../../src/common/internal";

describe('AbsoluteExpirationCache', () => {
    testCache(AbsoluteExpirationCache);

    it('Should remove value when it expired', async () => {
        await usingAsync(new AbsoluteExpirationCache<string, number>(() => TimeSpan.fromMilliseconds(300), () => TimeSpan.fromMilliseconds(100)),
            async cache => {
                cache.set('test', 10);

                expect(cache.containsKey('test')).toBeTruthy();

                await new Promise(resolve => setTimeout(resolve, 350));

                expect(cache.containsKey('test')).toBeFalsy();
            });
    });
});
