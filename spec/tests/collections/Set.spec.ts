import {testEnumerable} from "./common";
import {Set} from "../../../src/collections/internal";

describe('Set', () => {
    testEnumerable(a => new Set(a));
});
