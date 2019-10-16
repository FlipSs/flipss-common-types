import {IErrorObserver, IValueObserver} from "./internal";

export type Observer<T = void> = IValueObserver<Readonly<T>> | IErrorObserver;
