import {testEnumerableGeneric} from "./common";
import {Dictionary} from "../../../src/collections/Dictionary";

describe('Dictionary', () => {
    testEnumerableGeneric(a => new Dictionary(a.map(i => {
        return {
            key: i,
            value: i
        };
    })), v => v.value, {
        key: 15,
        value: 0
    });
});
