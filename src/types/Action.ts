import {Func} from "./internal";

export type Action<T1 = void, T2 = void, T3 = void, T4 = void, T5 = void> = Func<void, T1, T2, T3, T4, T5>;
