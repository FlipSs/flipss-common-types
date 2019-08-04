import {testEnumerable} from "./common";
import {List} from "../../../src/collections/internal";

describe('List', () => {
    testEnumerable(a => new List(a));
});
